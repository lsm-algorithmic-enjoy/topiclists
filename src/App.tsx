import React, { useEffect, useState } from "react";
import axios from "axios";

type Topic = {
  idx: number;
  title: string;
  imgPath: string;
};

function App() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const get_topics = async () => {
    try {
      const res = await axios.get<Topic[]>("http://localhost:4000/topics");
      setTopics(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    get_topics();
  }, []);

  return (
    <ul>
      {topics.map((topic) => (
        <li key={topic.idx}>
          <img src={topic.imgPath} />
          <p>{topic.title}</p>
        </li>
      ))}
      ;
    </ul>
  );
}

export default App;
