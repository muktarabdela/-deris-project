// lib/telegram.ts
declare global {
	interface Window {
		Telegram: {
			WebApp: ITelegramWebApp;
		};
	}
}

interface ITelegramWebApp {
	ready: () => void;
	initDataUnsafe: {
		user?: {
			id: number; // Telegram User ID
			first_name: string;
			username?: string;
			photo_url?: string;
			// ... other potential user fields
		};
	};
	// Add other methods/properties you might need later
}

/**
 * Loads the Telegram WebApp script dynamically.
 * @returns A promise that resolves when the script is loaded.
 */
export function loadTelegramWebApp(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (typeof window === "undefined") {
			// Not running in a browser environment
			reject(
				new Error("Cannot load Telegram WebApp outside of browser.")
			);
			return;
		}

		// Check if already loaded
		if (window.Telegram?.WebApp) {
			resolve();
			return;
		}

		// Check if script is already being loaded
		const existingScript = document.getElementById(
			"telegram-webapp-script"
		);
		if (existingScript) {
			// Wait for load or handle if already loaded
			existingScript.addEventListener("load", () => resolve());
			// Basic check if it loaded quickly before the event listener
			if (window.Telegram?.WebApp) resolve();
			return;
		}

		const script = document.createElement("script");
		script.src = "https://telegram.org/js/telegram-web-app.js";
		script.async = true;
		script.id = "telegram-webapp-script"; // Give it an ID for easy checking
		script.onload = () => {
			console.log("Telegram WebApp script loaded.");
			resolve();
		};
		script.onerror = (error) => {
			console.error("Failed to load Telegram WebApp script:", error);
			reject(new Error("Failed to load Telegram WebApp script."));
		};

		document.head.appendChild(script);
	});
}

/**
 * Gets the current Telegram user data.
 * Assumes the Telegram WebApp SDK is loaded.
 * @returns The user data object or null if not available.
 */
export function getTelegramUser() {
	if (typeof window !== "undefined" && window.Telegram?.WebApp) {
		return window.Telegram.WebApp.initDataUnsafe?.user || null;
	}
	return null;
}

/**
 * Signals to Telegram that the WebApp is ready.
 * Assumes the Telegram WebApp SDK is loaded.
 */
export function expandTelegramWebApp() {
	if (typeof window !== "undefined" && window.Telegram?.WebApp) {
		window.Telegram.WebApp.ready(); // Signal readiness
		// You might also want to use expand or other methods later
		// window.Telegram.WebApp.expand(); // Expand to full screen if needed
	}
}
