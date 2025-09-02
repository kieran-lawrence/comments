import { flaggedWords, rejectedWords } from '../constants/banned-words'

// These regex will matches any flagged/banned words, escaping special characters
const flaggedRegex = new RegExp(
    flaggedWords
        .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|'),
    'i',
)
const bannedRegex = new RegExp(
    rejectedWords
        .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|'),
    'i',
)

/** Returns true if the given comment contains any flagged words found in `flaggedWords` */
export const containsSuspectWords = (comment: string): boolean => {
    return flaggedRegex.test(comment)
}

/** Returns true if the given comment contains any banned words found in `rejectedWords` */
export const containsBannedWords = (comment: string): boolean => {
    return bannedRegex.test(comment)
}

/** Returns the input as a string or number, depending on its content */
export const parseStringOrNumber = (input: string): string | number => {
    const parsed = Number(input)
    return isNaN(parsed) ? input : parsed
}
