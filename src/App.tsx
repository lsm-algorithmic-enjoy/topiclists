import React, { useEffect, useState } from "react";
import axios from "axios";

type Topic = {
  idx: string;
  title: string;
  imgPath: string;
  grade: string;
  isLiked: boolean;
};

type Props = {
  topics: Topic[];
  topicPrefix: string;
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
};

function TopicMessage({ topics, topicPrefix, setTopics }: Props) {
  //topicprefix와 토픽 타이틀이 일치하는 토픽 리스트를 보여주기, 빈 문자열인 경우 모든 토픽 리스트 디폴트로 출력
  const escapetopic = topicPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // 특수 문자 이스케이프 처리
  const filteredTopics = topics.filter((topic) => {
    const regex = new RegExp(escapetopic, "i");
    return topic.title.match(regex);
  });

  async function toggleLike(idx: string) {
    const topicToUpdate = topics.find((topic) => topic.idx === idx);
    if (!topicToUpdate) return;

    const updatedTopic = {
      ...topicToUpdate,
      isLiked: !topicToUpdate.isLiked,
    };

    await axios.patch(`http://localhost:4000/topics/${idx}`, {
      isLiked: updatedTopic.isLiked,
    });

    const updatedTopics = topics.map((topic) =>
      topic.idx === idx ? updatedTopic : topic
    );

    setTopics(updatedTopics);
  }

  return (
    <ul>
      {filteredTopics.map(({ title, imgPath, idx, isLiked }) => {
        return (
          <li key={idx}>
            <img src={imgPath} alt={title} />
            <p>{title}</p>
            <button onClick={() => toggleLike(idx)}>
              {isLiked ? "지금 좋아" : "취소됨"}
            </button>
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
        setTopics={setTopics}
      />
    </>
  );
}

export default App;
