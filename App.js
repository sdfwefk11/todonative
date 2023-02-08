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
  Platform,
} from "react-native";
import { AntDesign, Feather, Fontisto } from "@expo/vector-icons";
import { theme } from "./color";
import AsyncStorage from "@react-native-async-storage/async-storage";
const STORAGE_KEY1 = "@todos_key";
const STORAGE_KEY2 = "@todos_bool";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [checkToggle, setCheckToggle] = useState(true);
  const [editing, setEdting] = useState(false);
  const [changeToDo, setChangeToDo] = useState("");
  const [editNum, setEditNum] = useState("");
  useEffect(() => {
    if (toDos !== null) {
      toDosLoad();
    } else {
      return;
    }
    loadWorkBool();
  }, []);
  const saveWorkBool = async () => {
    const saveWorking = JSON.stringify(working);
    await AsyncStorage.setItem(STORAGE_KEY2, saveWorking);
  };
  const loadWorkBool = async () => {
    const todos_bool = await AsyncStorage.getItem(STORAGE_KEY2);
    setWorking(JSON.parse(todos_bool));
  };
  const toDosLoad = async () => {
    const todos_key = await AsyncStorage.getItem(STORAGE_KEY1);
    setToDos(JSON.parse(todos_key));
  };
  const toDoSave = async (event) => {
    const saveTodos = JSON.stringify(event);
    await AsyncStorage.setItem(STORAGE_KEY1, saveTodos);
  };
  const travel = () => {
    setWorking(false);
  };
  const work = () => {
    setWorking(true);
  };
  useEffect(() => {
    saveWorkBool();
  }, [working]);
  const onChangeText = (payload) => {
    setText(payload);
  };
  const addTodo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text: text, work: working, check: false },
    };
    setToDos(newToDos);
    await toDoSave(newToDos);
    setText("");
  };
  const deleteToDo = (event) => {
    if (Platform.OS === "web") {
      const ok = confirm("할 일이 삭제됩니다.");
      if (ok) {
        const newToDos = { ...toDos };
        delete newToDos[event];
        setToDos(newToDos);
        toDoSave(newToDos);
      }
    } else {
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
    }
  };
  const checkToDos = (item, check) => {
    if (!check) {
      setCheckToggle(true);
      save(item);
    } else if (check) {
      setCheckToggle(false);
      save(item);
    }
    return;
  };
  const save = async (item) => {
    const newToDos = { ...toDos };
    const newToDos2 = { check: checkToggle };
    newToDos[item] = { ...toDos[item], ...newToDos2 };
    setToDos(newToDos);
    await toDoSave(newToDos);
  };
  const editText = (event) => {
    setEditNum(event);
    setEdting(true);
  };
  const editDone = async () => {
    if (changeToDo === "") {
      Alert.alert("오류", "아무것도 입력하지 않았습니다.", [{ text: "확인" }]);
    } else {
      const newToDos = { ...toDos };
      const newToDos2 = { text: changeToDo };
      newToDos[editNum] = { ...toDos[editNum], ...newToDos2 };
      setToDos(newToDos);
      setChangeToDo("");
      await toDoSave(newToDos);
      setEdting(false);
    }
  };
  const changeText = (event) => {
    setChangeToDo(event);
  };
  const cancelBtn = () => {
    setEdting(false);
  };
  const delAll = () => {
    if (working) {
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              fontSize: 38,
              fontWeight: "600",
              color: working ? "white" : theme.grey,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              fontSize: 38,
              fontWeight: "600",
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      {editing ? (
        <View>
          <TextInput
            style={{ ...styles.toDo, marginTop: 50 }}
            onChangeText={changeText}
            placeholder="Edit Here!"
          >
            {changeToDo}
          </TextInput>
          <View style={styles.checkBtn2}>
            <TouchableOpacity>
              <AntDesign
                name="check"
                size={40}
                color="blue"
                onPress={editDone}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Fontisto
                name="close-a"
                size={25}
                color="red"
                onPress={cancelBtn}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <TextInput
            returnKeyType="done"
            onSubmitEditing={addTodo}
            value={text}
            onChangeText={onChangeText}
            style={styles.input}
            placeholder={working ? "Work" : "Travel"}
          />
          <View style={styles.delAllBtn}>
            <AntDesign
              style={{ marginRight: 15 }}
              name="delete"
              size={24}
              color="red"
              onPress={delAll}
            />
          </View>
          <ScrollView>
            {Object.keys(toDos).map((item) =>
              toDos[item].work === working ? (
                <View key={item} style={styles.toDo}>
                  <Text
                    style={
                      toDos[item].check
                        ? {
                            ...styles.toDoText,
                            textDecorationLine: "line-through",
                            color: "red",
                          }
                        : styles.toDoText
                    }
                  >
                    {toDos[item].text}
                  </Text>

                  <TouchableOpacity
                    style={styles.checkBtn}
                    onPress={() => {
                      checkToDos(item, toDos[item].check);
                    }}
                  >
                    <Feather
                      name="check-square"
                      size={24}
                      color={theme.background}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editText(item)}>
                    <Feather name="edit" size={24} color={theme.background} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      deleteToDo(item);
                    }}
                  >
                    <AntDesign
                      name="delete"
                      size={24}
                      color={theme.background}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                ""
              )
            )}
          </ScrollView>
        </View>
      )}
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
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
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
  checkBtn: {
    marginLeft: 240,
  },
  checkBtn2: {
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
  },
  delAllBtn: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical: 20,
  },
});
