import { AudioPartModel } from "./AudioPart";
import { QuizQuestionModel } from "./QuizQuestion";

export interface QuizModel {
    id: string;
    audio_part_id: string;
    audio_part: AudioPartModel;
    questions: QuizQuestionModel[];
    createdAt: Date;
    updatedAt: Date;
}