import SendRoundedIcon from "@mui/icons-material/SendRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import {
  Box,
  Divider,
  Icon,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import "katex/dist/katex.min.css";
import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AzureLogo from "../assets/azure_logo.png";
import AiMarkdown from "../components/AiMarkdown";
import {
  BLACK,
  CHAT_AI_COLOR,
  CHAT_USER_COLOR,
  costInCentPerInputToken,
  costInCentPerOutputToken,
  customScrollBar,
  DARK_GREEN,
  GREEN,
  LIGHT_GREEN,
  RED,
  WHITE,
} from "../components/consts";
import { FooterLine } from "../components/Footer";
import { beautifyCostCentValue } from "../components/helpers";
import Typewriter from "../components/Typewriter";

export default function MainPage() {
  const [inputText, setInputText] = React.useState("");
  const [chatArray, setChatArray] = React.useState([]);
  const [loadingAnswer, setLoadingAnswer] = React.useState(false);
  const [skipAnimation, setSkipAnimation] = React.useState(false);
  const [writing, setWriting] = React.useState(false);

  const [promptTokens, setPromptTokens] = React.useState(0);
  const [completionTokens, setCompletionTokens] = React.useState(0);
  const [sessionCostConsumption, setSessionCostConsumption] = React.useState(0);
  const [functionExecutionTime, setFunctionExecutionTime] = React.useState(0);

  const [chartHistory, setChartHistory] = React.useState([]);

  const defaultSettings = {
    temperature: 0.7,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
    system_prompt: "",
    reasoningEffort: "medium",
  };

  const [settings, setSettings] = React.useState(defaultSettings);
  const selectedModel = "gpt-4o";

  async function sendMessage(chatMessage, clearInputField) {
    if (chatMessage === "") return;
    setChatArray((prev) => [
      {
        message: chatMessage,
        from: "user",
        timestamp: Date.now(),
      },
      ...prev,
    ]);
    if (clearInputField) setInputText("");

    try {
      setLoadingAnswer(true);
      const startTime = performance.now();
      const res = await axios.post(
        "/api/openai",
        {
          message: chatMessage,
          conversation: JSON.stringify(chatArray.slice(0, 10)),
          config: JSON.stringify(settings),
        },
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      const endTime = performance.now();
      const responseTimeInMs = (endTime - startTime).toFixed(2);
      setFunctionExecutionTime((prev) => prev + parseFloat(responseTimeInMs));

      const promptT = res.data.usage.prompt_tokens;
      const completionT = res.data.usage.completion_tokens;
      const cost =
        promptT * costInCentPerInputToken[selectedModel] +
        completionT * costInCentPerOutputToken[selectedModel];

      setPromptTokens((prev) => prev + promptT);
      setCompletionTokens((prev) => prev + completionT);
      setSessionCostConsumption((prev) => prev + cost);

      setChartHistory((prev) => {
        const updated = [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            promptTokens: promptT,
            completionTokens: completionT,
            executionTime: parseFloat(responseTimeInMs),
            cost: cost,
          },
        ];
        return updated.slice(-20); // letzte 20 Einträge
      });

      setLoadingAnswer(false);
      setChatArray((prev) => [
        {
          message: res.data.choices[0].message.content,
          from: "gpt",
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    } catch (e) {
      console.log(e);
      setLoadingAnswer(false);
      setChatArray((prev) => [
        {
          error: true,
          message: "Error in response. Please try again.",
          from: "gpt",
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    }
  }

  const fontSx = { fontFamily: "Inconsolata", fontSize: { xs: 12, md: 15 } };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: 1,
          alignItems: "center",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: 1,
            bgcolor: DARK_GREEN,
            height: 95,
            justifyContent: "space-between",
            alignItems: "center",
            userSelect: "none",
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Icon sx={{ width: "auto", height: 40, ml: 3 }}>
              <img draggable={false} src={AzureLogo} height="40px" />
            </Icon>
            <Typography
              sx={{
                ml: 2,
                mr: 3,
                fontFamily: "Inconsolata",
                color: WHITE,
                fontSize: { xs: 20, md: 26 },
                fontWeight: 400,
                userSelect: "none",
              }}
            >
              Azure | Serverless AI
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: { xs: 2, md: 4 },
            border: 1,
            borderColor: LIGHT_GREEN,
            p: 1,
          }}
        >
          <Typography sx={fontSx}>
            Used prompt tokens: {promptTokens} –{" "}
            {beautifyCostCentValue(
              costInCentPerInputToken[selectedModel] * 1000000
            )}{" "}
            / 1M Tokens
          </Typography>
          <Typography sx={fontSx}>
            Used completion tokens: {completionTokens} –{" "}
            {beautifyCostCentValue(
              costInCentPerOutputToken[selectedModel] * 1000000
            )}{" "}
            / 1M Tokens
          </Typography>
          <Typography sx={fontSx}>
            Total cost of AI usage:{" "}
            {beautifyCostCentValue(sessionCostConsumption)}
          </Typography>
          <Typography sx={fontSx}>
            Azure Function execution time: {functionExecutionTime}ms – 0.00005ct
            / 100000s
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 2,
            width: 0.95,
            mt: 4,
          }}
        >
          {["promptTokens", "completionTokens", "executionTime", "cost"].map(
            (key) => {
              const cumulativeData = chartHistory.reduce((acc, entry, idx) => {
                const previous = acc[idx - 1]?.value || 0;
                acc.push({
                  index: idx + 1,
                  value: previous + entry[key],
                  timestamp: entry.timestamp,
                });
                return acc;
              }, []);

              const labelMap = {
                promptTokens: "Cumulative Prompt Tokens",
                completionTokens: "Cumulative Completion Tokens",
                executionTime: "Cumulative Time (ms)",
                cost: "Cumulative Cost (ct)",
              };

              return (
                <Box
                  key={key}
                  sx={{
                    p: 2,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Inconsolata",
                      fontWeight: 600,
                      mb: 1,
                      fontSize: 14,
                    }}
                  >
                    {labelMap[key]}
                  </Typography>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={cumulativeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="index" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#1976d2"
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              );
            }
          )}
        </Box>

        {/* Chat Area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: 750,
            maxWidth: 0.9,
            mt: 5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: 1,
              flexDirection: "column-reverse",
              overflowY: "scroll",
              minHeight: "40vh",
              maxHeight: "40vh",
              ...customScrollBar(),
            }}
          >
            {loadingAnswer && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "flex-start",
                  mr: 2,
                  ml: 4,
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <LinearProgress
                  sx={{
                    width: 100,
                    mt: 0.5,
                    backgroundColor: BLACK,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: GREEN,
                    },
                  }}
                />
              </Box>
            )}
            {chatArray.map((chatObject, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    chatObject?.from === "user" ? "flex-end" : "flex-start",
                  alignSelf:
                    chatObject?.from === "user" ? "flex-end" : "flex-start",
                  mr: chatObject?.from === "user" ? 2 : 4,
                  ml: chatObject?.from === "gpt" ? 2 : 4,
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    bgcolor:
                      chatObject?.from === "user"
                        ? CHAT_USER_COLOR
                        : CHAT_AI_COLOR,
                    boxShadow: 4,
                  }}
                >
                  {index !== 0 ||
                  chatObject?.from === "user" ||
                  chatObject?.error ? (
                    <AiMarkdown>{chatObject.message}</AiMarkdown>
                  ) : (
                    <Typewriter
                      text={chatObject.message}
                      delay={10}
                      skipAnimation={skipAnimation}
                      setSkipAnimation={setSkipAnimation}
                      setWriting={setWriting}
                      setChatArray={setChatArray}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Textfeld */}
          <TextField
            disabled={writing}
            variant="filled"
            placeholder="Start a chat"
            onKeyDown={(e) => {
              if (e.keyCode === 13 && !e.shiftKey) {
                e.preventDefault();
                sendMessage(inputText, true);
              }
            }}
            size="small"
            sx={{
              width: 1,
              ".MuiInputBase-root": {
                borderRadius: 5,
                py: 1,
                pl: 2,
                mt: { xs: 2, md: 5 },
                display: "flex",
                height: 100,
              },
            }}
            slotProps={{
              htmlInput: {
                style: {
                  fontFamily: "Inconsolata",
                  fontSize: 16,
                  lineHeight: 1,
                  textAlign: "center",
                },
              },
              input: {
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: "0.5rem" }}>
                    {writing ? (
                      <IconButton onClick={() => setSkipAnimation(true)}>
                        <StopRoundedIcon color={RED} />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => sendMessage(inputText, true)}>
                        <SendRoundedIcon color={RED} />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              },
            }}
            multiline
            maxRows={2}
            spellCheck={false}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </Box>

        {/* Footer */}
        <FooterLine sxObject={{ mt: 4 }} typographySx={{ fontSize: 14 }}>
          Built using Microsoft Azure
        </FooterLine>
        <Divider flexItem sx={{ bgcolor: LIGHT_GREEN, mx: 4, mt: 2 }} />
      </Box>
    </Box>
  );
}
