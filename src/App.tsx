import React, { useEffect, useState } from "react";
import axios from "axios";

type Topic = {
  idx: number;
  title: string;
  imgPath: string;
};

type Props = {
  topics: Topic[];
  topicPrefix: string;
};

function TopicMessage({ topics, topicPrefix }: Props) {
  //topicprefix와 토픽 타이틀이 일치하는 토픽 리스트를 보여주기, 빈 문자열인 경우 모든 토픽 리스트 디폴트로 출력
  const escapetopic = topicPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // 특수 문자 이스케이프 처리
  const filteredTopics = topics.filter((topic) => {
    const regex = new RegExp(escapetopic, "i");
    return topic.title.match(regex);
  });
  return (
    <ul>
      {filteredTopics.map(({ title, imgPath, idx }) => {
        return (
          <li key={idx}>
            <img src={imgPath} alt={title} />
            <p>{title}</p>
          </li>
        );
      })}
    </ul>
  );
}

function App() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicPrefix, setTopicPrefix] = useState<string>("");

  function onChangeTopicPrefix({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) {
    setTopicPrefix(value.trim());
  }
  useEffect(() => {
    const getTopics = async () => {
      try {
        const res = await axios.get("http://localhost:4000/topics");
        setTopics(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getTopics();
  }, []);
  return (
    <>
      <input
        type="text"
        name="topicFilterInput"
        id="topicFilterInput"
        onChange={onChangeTopicPrefix}
      />
      <TopicMessage {...{ topics, topicPrefix }} />
    </>
  );
}

export default App;
