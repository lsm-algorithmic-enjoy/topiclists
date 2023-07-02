import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { styled } from "@mui/system";

const TopicFilterInput = styled(TextField)({
  width: "20%",
  marginTop: "10px",
});

const GradeTabContainer = styled("div")({
  display: "flex",
  marginBottom: "10px",
});

const GradeTabButton = styled(Button)<{ isActive: boolean }>(
  ({ isActive }) => ({
    border: isActive ? "2px solid skyblue" : "none",
  })
);

const TopicImage = styled("img")({
  width: "200px",
  height: "200px",
});

const AppContainer = styled("div")({
  margin: "10px 200px",
});

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
    <List>
      {filteredTopics.map(({ title, imgPath, idx, isLiked }) => (
        <ListItem key={idx}>
          <ListItemIcon>
            <TopicImage
              src={imgPath}
              alt={title}
              style={{ width: "200px", height: "200px" }}
            />
          </ListItemIcon>
          <ListItemText primary={title} style={{ marginLeft: "20px" }} />
          <IconButton onClick={() => toggleLike(idx)}>
            {isLiked ? (
              <ThumbUpAltIcon color="primary" />
            ) : (
              <ThumbUpOffAltIcon color="primary" />
            )}
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
}

function GradeTab({
  grade,
  selectedGrade,
  onGradeTabClick,
}: {
  grade: string;
  selectedGrade: string;
  onGradeTabClick: (grade: string) => void;
}) {
  const isActive = grade === selectedGrade;
  return (
    <GradeTabButton onClick={() => onGradeTabClick(grade)} isActive={isActive}>
      {grade === "" ? "전체" : grade}
    </GradeTabButton>
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
    <AppContainer>
      <GradeTabContainer>
        {["", "입문", "초급", "중급", "중고급", "고급"].map((grade) => (
          <GradeTab
            key={grade}
            grade={grade}
            selectedGrade={selectedGrade}
            onGradeTabClick={onGradeTabClick}
          />
        ))}
      </GradeTabContainer>
      <TopicFilterInput
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
    </AppContainer>
  );
}

export default App;
