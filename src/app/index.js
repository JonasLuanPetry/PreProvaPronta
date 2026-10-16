import { Link, Stack } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Este arquivo é a rota "/" — a tela que abre primeiro.
// O nome index é o único com significado especial: index.js de uma pasta é a
// tela daquela pasta.
export default function Inicio() {
  return (
    // edges={["bottom"]}: o cabeçalho já resolveu o topo, sobra a barra de
    // gestos embaixo. Com "bottom" na lista, o topo fica de fora — a
    // SafeAreaView NÃO põe nada lá. O paddingTop do estilo é espaçamento
    // nosso, não área segura: tire e o avatar cola no cabeçalho.
    <SafeAreaView style={styles.tela} edges={["bottom"]}>
      {/* Cada tela pode mexer no próprio cabeçalho */}
      <Stack.Screen options={{ title: "JOGOS" }} />
      <ScrollView>
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.saudacao}>Olá, Jogador N°67 </Text>
        </View>
      </View>

      <View style={styles.cartao}>
        <Text style={styles.cartaoTitulo}>Meus Jogos Suados</Text>
        <Text style={styles.detalhe}>Comprados com o meu suor!</Text>
        {/* href é o caminho do arquivo: notas.js vira "/notas" */}
        <Link href="/tela1" style={styles.link}>Lista de Jogos → </Link>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  cabecalho: {
    flexDirection: "center",
    alignItems: "center",
    gap: 14,
    marginBottom: 40,
    marginTop: 20,
  },

  saudacao: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },

  cartao: {
    backgroundColor: "#F1F3F6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 6,
  },

  cartaoTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  detalhe: {
    fontSize: 14,
    color: "#374151",
  },

  link: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2354D6",
    marginTop: 4,
  },
});