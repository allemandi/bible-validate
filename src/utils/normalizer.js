/**
 * Normalize input for case-insensitive comparison.
 */
function normalizeBook(name) {
    return name == null ? null : name.toLowerCase().trim();
}


export {
    normalizeBook,
};