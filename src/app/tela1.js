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
    prioridade INTEGER NOT NULL
  );
`);

function listar() {
    return db.getAllSync("SELECT * FROM tarefas ORDER BY id DESC");
}


function adicionar(texto, prioridade) {
    db.runSync("INSERT INTO tarefas (texto, prioridade) VALUES (?, ?)", [texto, prioridade]);
}

function remover(id) {
    db.runSync("DELETE FROM tarefas WHERE id = ?", [id]);
}

function atualizar(texto, prioridade, id) {
    db.runSync("UPDATE tarefas SET texto = ?, prioridade = ? WHERE id = ?", [
        texto,
        prioridade,
        id,
    ]);
}

export default function Lista() {
    const [texto, setTexto] = useState("");
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
        adicionar(texto, prioridade);
        setPrioridade("");
        setTexto("");
        carregar();
    }

    function guardarOuEditar() {
        if (idEditar == 0) {
            salvar(texto, prioridade);
        } else {
            atualizar(texto, prioridade, idEditar);
        }
        setIdEditar(0);
        setPrioridade("");
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
    }

    return (
        <SafeAreaView style={styles.tela}>
            <Stack.Screen options={{ title: "Agenda de Contatos" }} />
            <TextInput style={styles.lugarzinho} value={texto} onChangeText={setTexto} placeholder="Nome do Meliante"/>
            <TextInput style={styles.lugarzinho} value={prioridade} onChangeText={setPrioridade} placeholder="Número do Meliante" keyboardType="numeric"/>
            {idEditar !== 0 ? (
            <Button title="METER" onPress={guardarOuEditar} />
            ) : (
            <Button title="SOCAR" onPress={salvar} />
            )}
            <FlatList data={lista} renderItem={({ item }) => (
                <View style={styles.itemApagar}>
                    <Text style={styles.item}>{item.texto} - {item.prioridade}</Text>
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