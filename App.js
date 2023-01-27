import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "./color";
import AsyncStorage from "@react-native-async-storage/async-storage";
const STORAGE_KEY = "@todos_key";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    toDosLoad();
  }, []);
  const toDosLoad = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };
  const toDoSave = async (event) => {
    const saveTodos = JSON.stringify(event);
    await AsyncStorage.setItem(STORAGE_KEY, saveTodos);
  };
  const travel = () => {
    setWorking(false);
  };
  const work = () => {
    setWorking(true);
  };
  const onChangeText = (payload) => {
    setText(payload);
  };
  const addTodo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = { ...toDos, [Date.now()]: { text: text, work: working } };
    setToDos(newToDos);
    await toDoSave(newToDos);
    setText("");
  };
  const deleteToDo = (event) => {
    Alert.alert("삭제", "할 일이 삭제됩니다.", [
      { text: "취소" },
      {
        text: "삭제",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[event];
          setToDos(newToDos);
          await toDoSave(newToDos);
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          returnKeyType="done"
          onSubmitEditing={addTodo}
          value={text}
          onChangeText={onChangeText}
          style={styles.input}
          placeholder={working ? "Work" : "Travel"}
        />
        <ScrollView>
          {Object.keys(toDos).map((item) =>
            toDos[item].work === working ? (
              <View key={item} style={styles.toDo}>
                <Text style={styles.toDoText}>{toDos[item].text}</Text>
                <TouchableOpacity
                  onPress={() => {
                    deleteToDo(item);
                  }}
                >
                  <AntDesign name="delete" size={24} color={theme.background} />
                </TouchableOpacity>
              </View>
            ) : (
              ""
            )
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
    paddingHorizontal: 20,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 30,
    fontSize: 15,
  },
  toDo: {
    backgroundColor: "#FFE6F2",
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    fontSize: 15,
    fontWeight: "500",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "black",
  },
});
