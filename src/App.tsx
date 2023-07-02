import React, { useEffect, useState } from "react";
import axios from "axios";

type Topic = {
  idx: number;
  title: string;
  imgPath: string;
  grade: string;
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
  const [selectedGrade, setSelectedGrade] = useState<string>("");

  function onChangeTopicPrefix({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) {
    setTopicPrefix(value.trim());
  }

  function onGradeTabClick(grade: string) {
    setSelectedGrade(grade);
  }

  function getFilteredTopicsByGrade() {
    // 토픽 리스트를 Grade별로 필터링하는 함수
    if (selectedGrade === "") {
      return topics;
    } else {
      return topics.filter((topic) => topic.grade === selectedGrade);
    }
  }

  useEffect(() => {
    async function getTopics() {
      try {
        const res = await axios.get("http://localhost:4000/topics");
        setTopics(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    getTopics();
  }, []);

  return (
    <>
      <div>
        <button onClick={() => onGradeTabClick("")}>전체</button>
        <button onClick={() => onGradeTabClick("입문")}>입문</button>
        <button onClick={() => onGradeTabClick("초급")}>초급</button>
        <button onClick={() => onGradeTabClick("중급")}>중급</button>
        <button onClick={() => onGradeTabClick("중고급")}>중고급</button>
        <button onClick={() => onGradeTabClick("고급")}>고급</button>
      </div>
      <input
        type="text"
        name="topicFilterInput"
        id="topicFilterInput"
        onChange={onChangeTopicPrefix}
      />
      <TopicMessage
        topics={getFilteredTopicsByGrade()}
        topicPrefix={topicPrefix}
      />
    </>
  );
}

export default App;
