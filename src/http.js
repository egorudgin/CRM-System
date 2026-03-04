import axios from 'axios';

export default class TodoService {
  static async getAll(filter = 'all') {
    try {
      const response = await axios.get(`https://easydev.club/api/v1/todos?filter=${filter}`);
      return response.data.data;
    } catch (error) {
      console.log('error');
    }
  }

  static async create(title) {
    try {
      const response = await axios.post('https://easydev.club/api/v1/todos', {
        title,
        isDone: false,
      });
      return response.data;
    } catch (error) {
      console.log('error');
    }
  }

  static async edit(id, changes) {
    try {
      const response = await axios.put(`https://easydev.club/api/v1/todos/${id}`, changes);
      return response.data;
    } catch (error) {
      console.log('error');
    }
  }

  static async delete(id) {
    try {
      const response = await axios.delete(`https://easydev.club/api/v1/todos/${id}`);
      return response.data;
    } catch (error) {
      console.log('error');
    }
  }
}
