export async function getAll(filter = 'all') {
  const response = await fetch(`https://easydev.club/api/v1/todos?filter=${filter}`);

  if (!response.ok) {
    throw new Error('Ошибка при получении данных');
  }

  const resData = await response.json();

  return {
    todos: resData.data,
    info: resData.info,
  };
}

export async function create(title) {
  const response = await fetch('https://easydev.club/api/v1/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      isDone: false,
    }),
  });

  if (!response.ok) {
    throw new Error('Ошибка при создании');
  }

  return await response.json();
}

export async function edit(id, changes) {
  const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(changes),
  });

  if (!response.ok) {
    throw new Error('Ошибка при редактировании');
  }

  return await response.json();
}

export async function deleteTodo(id) {
  const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Ошибка при удалении');
  }

  return;
}
