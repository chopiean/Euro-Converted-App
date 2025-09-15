import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EuroConverter() {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [rates, setRates] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(
          "https://api.apilayer.com/exchangerates_data/latest?base=EUR",
          {
            headers: { apikey: "oO5JCLsedoJC04RV76zbawuFNSZdRjxV" },
          }
        );
        const data = await res.json();
        console.log("API error:", data);
        if (data && data.rates) {
          setRates(data.rates);
          setCurrencies(Object.keys(data.rates));
          setSelectedCurrency("USD");
        }
      } catch (error) {
        console.error("Error fetching rates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const handleConvert = () => {
    const value = parseFloat(amount);
    if (isNaN(value)) return;
    const rate = rates[selectedCurrency];
    if (rate) {
      const converted = value / rate;
      setResult(converted);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading exchange rates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://em-content.zobj.net/thumbs/240/apple/354/euro-banknote_1f4b6.png",
        }}
        style={{ width: 100, height: 100, marginBottom: 20 }}
      />

      {result !== null && (
        <Text style={styles.result}>{result.toFixed(2)} €</Text>
      )}

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Picker
          selectedValue={selectedCurrency}
          style={{ flex: 1 }}
          onValueChange={(itemValue: string) => setSelectedCurrency(itemValue)}
        >
          {currencies.map((currency) => (
            <Picker.Item key={currency} label={currency} value={currency} />
          ))}
        </Picker>
      </View>

      <Button title="CONVERT" onPress={handleConvert} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  result: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginRight: 10,
    borderRadius: 5,
    textAlign: "center",
  },
});
