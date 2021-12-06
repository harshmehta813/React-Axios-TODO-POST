import axios from "axios";
import { useEffect, useState } from "react";
import TodoInput from "./TodoInput";

const getTodos = () => {
  const config = {
    url: "https://json-server-mocker-masai.herokuapp.com/tasks",
    method: "get"
  };
  return axios(config);
};

const createTodo = (title) => {
  const payload = {
    title,
    status: false
  };
  const config = {
    url: "https://json-server-mocker-masai.herokuapp.com/tasks",
    method: "post",
    data: payload
  };
  return axios(config);
};

function Todos() {
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    handleGetTodos();
  }, []);

  const handleGetTodos = () => {
    return getTodos()
      .then((res) => {
        setTodos(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateTodo = (id, status) => {
    return axios({
      url: `https://json-server-mocker-masai.herokuapp.com/tasks/${id}`,
      method: "patch",
      data: {
        status: status
      }
    });
  };
  const markEverythingAsComplete = async () => {
    try {
      const ids = todos.map((item) => item.id);

      for (let id of ids) {
        console.log(id);
        await updateTodo(id, true);
      }
      await handleGetTodos();
    } catch (err) {}
  };

  const onSubmit = async (title) => {
    try {
      setIsLoading(true);
      await createTodo(title);
      await handleGetTodos();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  if (isLoading) {
    return <div>...loading</div>;
  }
  return (
    <div>
      <TodoInput onSubmit={onSubmit} />
      {todos.map((item) => (
        <div key={item.id}>
          <div>{item.title}</div>
          <div>{item.status ? "DONE" : "NOT DONE"}</div>
        </div>
      ))}
      <div>
        <button onClick={markEverythingAsComplete}>MARK ALL COMPLETED</button>
      </div>
    </div>
  );
}

export default Todos;
