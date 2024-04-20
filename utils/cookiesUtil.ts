import * as crypto from "crypto";
import { TFile } from 'obsidian';

export const generateRandomString = (length: number): string => {
	const characters = 'ijklmnopqrstuvabcdefghijklmnopqrstuvwxyz123456789';
	let randomString = '';
  
	for (let i = 0; i < length; i++) {
	  const randomIndex = Math.floor(Math.random() * characters.length);
	  randomString += characters.charAt(randomIndex);
	}
  
	return randomString;
}

export const chooseBoundary = (): string => {
  const boundary = crypto.randomBytes(16).toString("hex");
  return boundary;
}