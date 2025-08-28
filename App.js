import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [tarefa, setTarefa] = useState('');
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    async function carregarTarefas() {
      try {
        const json = await AsyncStorage.getItem('tarefas');
        if (json) {
          const data = JSON.parse(json);
          if (Array.isArray(data)) setTarefas(data);
        }
      } catch {}
    }
    carregarTarefas();
  }, []);

  async function salvarLista(novaLista) {
    try {
      await AsyncStorage.setItem('tarefas', JSON.stringify(novaLista));
    } catch {}
  }

  async function adicionarTarefa() {
    const titulo = tarefa.trim();
    if (!titulo) {
      alert('Digite uma tarefa primeiro!');
      return;
    }
    const jaExiste = tarefas.some((t) => t.titulo.toLowerCase() === titulo.toLowerCase());
    if (jaExiste) {
      alert('Essa tarefa já existe.');
      return;
    }
    const nova = { id: Date.now().toString(), titulo };
    const lista = [nova, ...tarefas];
    setTarefas(lista);
    setTarefa('');
    await salvarLista(lista);
  }

  async function excluirTarefa(id) {
    const lista = tarefas.filter((t) => t.id !== id);
    setTarefas(lista);
    await salvarLista(lista);
  }

  return (
    <ImageBackground
      source={require('./assets/clash royalw.jpg')}
      style={styles.image}
      resizeMode="cover"
    >
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View style={styles.container}>
          <View style={styles.cardContainer}>
            <Text style={styles.titulo}>Lista de Tarefas ✅</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite uma nova tarefa"
              value={tarefa}
              onChangeText={setTarefa}
              onSubmitEditing={adicionarTarefa}
              returnKeyType="done"
            />
            <Button title="Adicionar" onPress={adicionarTarefa} color="#5EFF00" />

            <FlatList
              style={styles.lista}
              data={tarefas}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={<Text style={styles.vazio}>Nenhuma tarefa ainda.</Text>}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.itemTexto}>{item.titulo}</Text>
                  <TouchableOpacity
                    style={styles.itemExcluir}
                    onPress={() => excluirTarefa(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Excluir tarefa ${item.titulo}`}
                  >
                    <Text style={styles.itemExcluirTexto}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={
                tarefas.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : undefined
              }
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#54b81aff',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    width: '70%',
    backgroundColor: '#fff',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  cardContainer: {
    backgroundColor: '#ffffffc0',
    width: '70%',
    height: '80%',
    borderRadius: 15,
    alignItems: 'center',
    padding: 16,
  },
  lista: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
  vazio: {
    textAlign: 'center',
    color: '#666',
    marginTop: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemTexto: {
    fontSize: 16,
    flex: 1,
    marginRight: 12,
  },
  itemExcluir: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  itemExcluirTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});