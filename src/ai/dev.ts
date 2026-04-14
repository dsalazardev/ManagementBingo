import { config } from 'dotenv';
config();

import '@/ai/flows/generate-game-definitions-flow.ts';
import '@/ai/flows/validate-bingo-claim-flow.ts';