import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Header } from "../components/Header";
import "./newTask.scss";
import { useNavigate } from "react-router-dom";

export const NewTask = () => {
  const url = "https://g6gg9n0hrj.execute-api.ap-northeast-1.amazonaws.com/";
  const [selectListId, setSelectListId] = useState();
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState("");

  const [detail, setDetail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const handleLimitChange = (e) => setLimit(e.target.value);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleSelectList = (id) => setSelectListId(id);
  const getCurrentDateTimeInJapan = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 月は0から始まるため+1する
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const japanTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    return japanTime;
  };
  const [limit, setLimit] = useState(getCurrentDateTimeInJapan());
  const onCreateTask = () => {
    const data = {
      title: title,
      detail: detail,
      limit: `${limit}:00Z`,
      done: false,
    };
    console.log(data);

    axios
      .post(`${url}/lists/${selectListId}/tasks`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        setErrorMessage(`タスクの作成に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
        setSelectListId(res.data[0]?.id);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, []);

  return (
    <div>
      <Header />
      <main className="new-task">
        <h2>タスク新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-task-form">
          <label>リスト</label>
          <br />
          <select
            onChange={(e) => handleSelectList(e.target.value)}
            className="new-task-select-list"
          >
            {lists.map((list, key) => (
              <option key={key} className="list-item" value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
          <br />

          <label>タイトル</label>
          <br />
          <input
            type="text"
            autoComplete="current-password"
            onChange={handleTitleChange}
            className="new-task-title"
          />
          <br />
          <label>詳細</label>
          <br />
          <textarea
            type="text"
            onChange={handleDetailChange}
            className="new-task-detail"
          />
          <br />
          <label>締切(YYYY/MM/DD HH:MM)</label>
          <br />
          <input
            type="datetime-local"
            value={limit}
            autoComplete="current-password"
            onChange={handleLimitChange}
            className="new-task-limit"
          />
          <br />
          <button
            type="button"
            className="new-task-button"
            onClick={onCreateTask}
          >
            作成
          </button>
        </form>
      </main>
    </div>
  );
};
