"use client";

import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';

export function ProfileButton() {
	const router = useRouter();

	return (
		<button
			onClick={() => router.push('/profile')}
			className="p-1.5 rounded-full hover:bg-accent transition-colors"
			aria-label="User profile"
		>
			<User className="h-5 w-5" />
		</button>
	);
}
