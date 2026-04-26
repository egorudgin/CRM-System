export function validateTodoTitle(title) {
  const trimmedTitle = title.trim();

  if (trimmedTitle.length < 2) {
    return 'Минимум 2 символа';
  }

  if (trimmedTitle.length > 64) {
    return 'Максимум 64 символа';
  }

  return '';
}
