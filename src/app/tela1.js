import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("lista.db");

db.execSync(`
  CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto TEXT NOT NULL,
    segmento TEXT NOT NULL,
    prioridade INTEGER NOT NULL
  );
`);

function listar() {
    return db.getAllSync("SELECT * FROM tarefas ORDER BY id DESC");
}


function adicionar(texto, segmento, prioridade) {
    db.runSync("INSERT INTO tarefas (texto, segmento, prioridade) VALUES (?, ?, ?)", [texto, segmento, prioridade]);
}

function remover(id) {
    db.runSync("DELETE FROM tarefas WHERE id = ?", [id]);
}

function atualizar(texto, segmento, prioridade, id) {
    db.runSync("UPDATE tarefas SET texto = ?, segmento = ?, prioridade = ? WHERE id = ?", [
        texto,
        segmento,
        prioridade,
        id,
    ]);
}

export default function Lista() {
    const [texto, setTexto] = useState("");
    const [segmento, setSegmento] = useState("");
    const [lista, setLista] = useState([]);
    const [prioridade, setPrioridade] = useState("");
    const [idEditar, setIdEditar] = useState(0);

    function carregar() {
        setLista(listar());
    }

    useEffect(() => {
        carregar();
    }, []);

    function salvar() {
        adicionar(texto, segmento, prioridade);
        setPrioridade("");
        setSegmento("");
        setTexto("");
        carregar();
    }

    function guardarOuEditar() {
        if (idEditar == 0) {
            salvar(texto, segmento, prioridade);
        } else {
            atualizar(texto, segmento, prioridade, idEditar);
        }
        setIdEditar(0);
        setPrioridade("");
        setSegmento("");
        setTexto("");
        carregar();
    }

    function apagar(id) {
        remover(id);
        carregar();
    }

    function editar(lista) {
        setIdEditar(lista.id);
        setTexto(lista.texto);
        setPrioridade(lista.prioridade);
        setSegmento(lista.segmento);
    }

    return (
        <SafeAreaView style={styles.tela}>
            <Stack.Screen options={{ title: "Meus Jogos" }} />
            <TextInput style={styles.lugarzinho} value={texto} onChangeText={setTexto} placeholder="Nome..."/>
            <TextInput style={styles.lugarzinho} value={segmento} onChangeText={setSegmento} placeholder="Plataforma..."/>
            <TextInput style={styles.lugarzinho} value={prioridade} onChangeText={setPrioridade} placeholder="Horas Playadas..." keyboardType="numeric"/>
            {idEditar !== 0 ? (
            <Button title="Atualizar" onPress={guardarOuEditar} />
            ) : (
            <Button title="Adicionar" onPress={salvar} />
            )}
            <FlatList data={lista} renderItem={({ item }) => (
                <View style={styles.itemApagar}>
                    <Text style={styles.item}>{item.texto} - {item.segmento} - {item.prioridade}</Text>
                    <Button title="EXC" onPress={() => apagar(item.id)} />
                    <Button title="EDT" onPress={() => editar(item)} />
                </View>)} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    tela: {
        flex: 1,
        padding: 28,
        backgroundColor: "white",
    },

    lugarzinho: {
        borderWidth: 1,
        height: 40,
        marginBottom: 10,
    },

    item: {
        backgroundColor: "#444",
        color: "white",
        padding: 10,
        marginTop: 5,
        flex: 1,
    },

    itemApagar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
    },
});