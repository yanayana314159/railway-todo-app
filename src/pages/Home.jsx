//https://developer.mozilla.org/ja/docs/Web/HTML/Element/input/datetime-local
//期限の文字列を見やすい形に直す

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Header } from "../components/Header";
import "./home.scss";

export const Home = () =　> {
  const url = "https://g6gg9n0hrj.execute-api.ap-northeast-1.amazonaws.com/";
  const [isDoneDisplay, setIsDoneDisplay] = useState("todo"); // todo->未完了 done->完了
  const [lists, setLists] = useState([]);
  const [selectListId, setSelectListId] = useState();
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies] = useCookies();
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value);
  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, []);

  useEffect(() => {
    const listId = lists[0]?.id;
    if (typeof listId !== "undefined") {
      setSelectListId(listId);
      axios
        .get(`${url}/lists/${listId}/tasks`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((res) => {
          setTasks(res.data.tasks);
        })
        .catch((err) => {
          setErrorMessage(`タスクの取得に失敗しました。${err}`);
        });
    }
  }, [lists]);

  const handleSelectList = (id) => {
    setSelectListId(id);
    axios
      .get(`${url}/lists/${id}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((err) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`);
      });
  };
  return (
    <div>
      <Header />
      <main className="taskList">
        <p className="error-message">{errorMessage}</p>
        <div>
          <div className="list-header">
            <h2>リスト一覧</h2>
            <div className="list-menu">
              <p>
                <Link to="/list/new" tabIndex="-1 ">
                  リスト新規作成
                </Link>
              </p>
              <p>
                <Link to={`/lists/${selectListId}/edit`} tabIndex="-1 ">
                  選択中のリストを編集
                </Link>
              </p>
            </div>
          </div>
          <ul
            className="list-tab"
            role="tablist"
            aria-labelledby="tablist-label"
          >
            {lists.map((list, index) => {
              const isActive = list.id === selectListId;
              const tabId = `tab-${list.id}`;
              const panelId = `panel-${list.id}`;

              const handleListSelect = (id) => {
                setSelectListId(id);
                handleSelectList(id);
              };

              return (
                <li
                  key={list.id}
                  role="tab"
                  aria-controls={panelId}
                  aria-selected={isActive}
                  tabIndex="1 " // キーボードフォーカス可能にする
                  id={tabId}
                  className={`list-tab-item ${isActive ? "active" : ""}`}
                  onClick={() => handleListSelect(list.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleListSelect(list.id);
                    }
                  }}
                  // キーボードフォーカス時のスタイリングなどを追加できます
                >
                  {list.title}
                </li>
              );
            })}
          </ul>

          <div className="tasks">
            <div className="tasks-header">
              <h2>タスク一覧</h2>
              <Link to="/task/new" tabIndex="-1">
                タスク新規作成
              </Link>
            </div>
            <div className="display-select-wrapper">
              <select
                onChange={handleIsDoneDisplayChange}
                className="display-select"
                tabIndex="-1"
              >
                <option value="todo">未完了</option>
                <option value="done">完了</option>
              </select>
            </div>
            <Tasks
              tasks={tasks}
              selectListId={selectListId}
              isDoneDisplay={isDoneDisplay}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
const formatTaskLimit = (limit) => {
  const formattedLimit = limit
    .replace(/-/g, "/")
    .replace("T", " ")
    .replace(":00Z", "");

  return formattedLimit;
};
// 表示するタスク
const Tasks = (props) => {
  const { tasks, selectListId, isDoneDisplay } = props;
  const timediff = (limit) => {
    const limitDate = new Date(limit);
    const currentDate = new Date();
    const timeDifference = limitDate - currentDate - 1000 * 60 * 60 * 9;
    if (timeDifference < 0) {
      return "締切を過ぎています";
    }
    // ミリ秒から日、時間、分に変換
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    return `残り: ${days}日 ${hours}時間 ${minutes}分`;
  };

  if (tasks === null) return <></>;

  if (isDoneDisplay == "done") {
    return (
      <ul>
        {tasks
          .filter((task) => {
            return task.done === true;
          })
          .map((task, key) => (
            <li key={key} className="task-item">
              <Link
                to={`/lists/${selectListId}/tasks/${task.id}`}
                className="task-item-link"
                tabIndex="-1"
              >
                {task.title}
                {task.limit}
                <br />
                {task.done ? "完了" : "未完了"}
              </Link>
            </li>
          ))}
      </ul>
    );
  }

  return (
    <ul>
      {tasks
        .filter((task) => {
          return task.done === false;
        })
        .map((task, key) => (
          <li key={key} className="task-item">
            <Link
              to={`/lists/${selectListId}/tasks/${task.id}`}
              className="task-item-link"
              tabIndex="-1"
            >
              <div className="task-item-info">
                <div className="task-main">
                  <p>タスク名：{task.title}</p>
                  <p>{task.done ? "完了" : "未完了"}</p>
                </div>
                <div className="task-limit">
                  <p>期限：{formatTaskLimit(task.limit)}</p>
                  <p className="task-limit-diff">{timediff(task.limit)}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
    </ul>
  );
};
