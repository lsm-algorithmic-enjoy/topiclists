import React, { useEffect, useState } from "react";
import axios from "axios";

type Topic = {
  idx: number;
  title: string;
  imgPath: string;
};

function App() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const getTopics = async () => {
    try {
      const res = await axios.get("http://localhost:4000/topics");
      setTopics(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    getTopics();
  }, []);

  return (
    <ul>
      {topics.map((topic) => (
        <li key={topic.idx}>
          <img src={topic.imgPath} alt={topic.title} />
          <p>{topic.title}</p>
        </li>
      ))}
    </ul>
  );
}

export default App;
