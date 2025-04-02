import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Modal, FlatList, ImageBackground, ActivityIndicator, Platform, NativeModules } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../../context/ThemeProvider';
import { images } from '../../../constants'; 
import { Picker } from '@react-native-picker/picker';
import { Pipeline } from "react-native-transformers";

const Home = () => {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [viewType, setViewType] = useState<'table' | 'summary'>('summary');
  const [expandedTable, setExpandedTable] = useState(false);
  const [expandedSummary, setExpandedSummary] = useState(false);
  const VISIBLE_ROW_LIMIT = 5;
  const SUMMARY_LINE_LIMIT = 8;

  const [responseData, setResponseData] = useState<{ summary?: string; records?: any[] | undefined } | null>(null);

  const [admissionOptions, setAdmissionOptions] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);

  
  const INITIAL_CONVERSATION: Message[] = [
    {
      role: "system",
      content:
        "You are an expert medical assistant.",
    },
  ];

  
  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  type Message = {
    role: "user" | "assistant" | "system" | "error";
    content: string;
  };

  const [conversation, setConversation] = useState<Message[]>(INITIAL_CONVERSATION);

  const tables = ['admissions', 'diagnosis', 'medications', 'procedures', 'icustays', 'microbiology_events', 'chartevents'];

  

  const initializeModel = async () => {
    try {
      if (!NativeModules.Transformers) {
        throw new Error("Native module not registered");
      }
  
      await NativeModules.Transformers.initialize();

      console.log("Transformers module:", NativeModules.Transformers);

      const modelPath = Platform.select({
        android: 'file:///android_asset/onnx/decoder_model_merged_quantized.onnx',
        ios: 'onnx/decoder_model_merged_quantized.onnx',
      });
  
      const result = await NativeModules.Transformers.createPipeline(
        'text-generation',
        {
          model: modelPath,
          config: {
            model_type: 'llama',
            n_ctx: 2048
          }
        }
      );
  
      console.log("Pipeline created:", result);
      return result;
    } catch (error) {
      console.error("Initialization failed:", error);
      throw error;
    }
  };
  
  useEffect(() => {
    initializeModel();
  }, []);

  const generateText = (prompt : string) => {
    setOutput("");
    // Generate text from the prompt and update the UI as tokens are generated
    Pipeline.TextGeneration.generate(
       `Summarize these medical records and highlight the medical terms:\n\n ${prompt}`,
      (text) => setOutput(text)
    );
    console.log(output)
  };

  // const handlePromptInference = async (records: any) => {
    
  //     if (!records || records.length === 0) {
  //       Alert.alert("No Data", "No records available for summarization.");
  //       return;
  //     }

  //     if (!llama.isModelReady) {
  //       Alert.alert("Model Loading", "Please wait for the model to load.");
  //       console.log(llama.downloadProgress)
  //       return;
  //     }
  
  //     const fixedPrompt = `Summarize these medical records and highlight the medical terms:\n\n${JSON.stringify(records, null, 2)}`;
    
  //     try {
  //       const response = await llama.generate(fixedPrompt);
        
  //       console.log('Llama says:', llama.response);

  //       if (response!= null) {
  //         setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
  //       } else {
  //         console.error("Error: Response is empty or undefined.");
  //         setMessages((prev) => [...prev, { role: 'error', content: "Failed to generate response." }]);
  //       }
  //     } catch (error) {
  //       console.log("Inference error:", error);
  //       Alert.alert("Error", "Failed to generate summary.");
  //     }
  //   };
    

  const submit = async () => {
    setShowModal(false);
    
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter a Subject ID.');
      return;
    }
    if (!selectedTable) {
      Alert.alert('Error', 'Please select a table.');
      return;
    }

    setUploading(true);
    
    try {
      
      const response = await axios.get(
        `http://192.168.12.33:5050/api/medical_records/${selectedId}/${selectedTable}`,
        // `http://192.168.1.14:5050/api/medical_records/${selectedId}/${selectedTable}`,
        { headers: { 'Content-Type': 'application/json' }}
      );

      const records = response.data.table?.records || [];

      setResponseData({ records })

      await generateText(records);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data.');
      setResponseData(null);
    }
    setUploading(false);
  };


  const handleAdmissionSelection = async (selected: any) => {
    try {
      const response = await axios.post(
        `http://192.168.12.33:5050/api/admissions/${text}`,
        // `http://192.168.1.14:5050/api/admissions/${text}`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log(response.data.admissions)
      setAdmissionOptions(response.data.admissions);
      setShowModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit selection.');
    }
  };

  return (
    <ImageBackground
      source={theme === 'dark' ? images.dark : images.background}
      style={styles.backgroundImage}
    >
    <View style={styles.container}>
    {/* <View style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}> */}
      <Text style={[styles.heading, theme === 'dark' ? styles.darkText : styles.lightText]}>Patients Summary</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.textInput, theme === 'dark' ? styles.darkInput : styles.lightInput]}
          value={text}
          onChangeText={setText}
          placeholder="Type the Subject ID here..."
          placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
        />
        <TouchableOpacity 
            onPress={handleAdmissionSelection}
            style={[styles.sendButton, uploading ? styles.disabledButton : styles.activeButton]}
            activeOpacity={0.7}
            disabled={uploading}
        >
            <Text style={[styles.sendButtonText, theme === 'dark' ? styles.darkText : styles.lightText]}>
            Send
            </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedTable}
          onValueChange={(itemValue: any) => setSelectedTable(itemValue)}
          style={[styles.picker, theme === 'dark' ? styles.darkPicker : styles.lightPicker]}
          dropdownIconColor={theme === 'dark' ? '#fff' : '#000'}
        >
          <Picker.Item label="Select a table..." value="" />
          {tables.map((table) => (
            <Picker.Item key={table} label={table.replace(/_/g, ' ').toUpperCase()} value={table} />
          ))}
        </Picker>
      </View>

      <View style={styles.viewToggleContainer}>
        <TouchableOpacity
          style={[styles.viewToggleButton, viewType === 'table' && styles.selectedViewToggle]}
          onPress={() => setViewType('table')}
        >
          <Text style={styles.toggleButtonText}>TABLE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.viewToggleButton, viewType === 'summary' && styles.selectedViewToggle]}
          onPress={() => setViewType('summary')}
        >
          <Text style={styles.toggleButtonText}>SUMMARY</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={[styles.responseContainer, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      {uploading ? (
        <ActivityIndicator size="large" color={theme === 'dark' ? "#fff" : "#2196F3"} style={styles.loader} />
      ) : (
        <>
      {responseData?.summary && viewType === 'summary' ? (
          <>
            <Text style={[styles.summaryText, theme === 'dark' ? styles.darkText : styles.lightText]}>
              {expandedSummary
                ? responseData.summary
                : responseData.summary.split('\n').slice(0, SUMMARY_LINE_LIMIT).join('\n') +
                  (responseData.summary.split('\n').length > SUMMARY_LINE_LIMIT ? '...' : '')}
            </Text>

            {responseData.summary.split('\n').length > SUMMARY_LINE_LIMIT && (
              <TouchableOpacity onPress={() => setExpandedSummary(!expandedSummary)} style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>{expandedSummary ? "Show Less" : "Read More"}</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          viewType === 'summary' && <Text style={[styles.summaryText, theme === 'dark' ? styles.darkText : styles.lightText]}>No summary available.</Text>
        )}
      {viewType === 'table' && Array.isArray(responseData?.records) && responseData.records.length > 0 ? (
        <View style={styles.tableWrapper}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            {Object.keys(responseData.records[0]).map((key, idx) => (
              <View key={idx} style={[styles.tableCell, styles.tableHeaderCell]}>
                <Text style={styles.tableHeaderText}>{key.toUpperCase()}</Text>
              </View>
            ))}
          </View>

          {/* Table Rows */}
          {responseData.records
            .slice(0, expandedTable ? responseData.records.length : VISIBLE_ROW_LIMIT)
            .map((record: { [s: string]: unknown; } | ArrayLike<unknown>, rowIndex: number) => (
              <View key={rowIndex} style={[styles.tableRow, rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                {Object.values(record).map((value, colIndex) => (
                  <View key={colIndex} style={[styles.tableCell]}>
                    <Text style={styles.tableCellText}>{String(value)}</Text>
                  </View>
                ))}
              </View>
            ))}

          {/* Read More / Read Less Button */}
          {responseData.records.length > VISIBLE_ROW_LIMIT && (
            <TouchableOpacity onPress={() => setExpandedTable(!expandedTable)} style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>{expandedTable ? "Show Less" : "Read More"}</Text>
            </TouchableOpacity>
          )}
        </View>
        ) : (
          <Text style={[styles.summaryText, theme === 'dark' ? styles.darkText : styles.lightText]}>
            No table data available.
          </Text>
        )}
        </>
      )}
      </ScrollView>

      {/* Admission Selection Modal with Table Format */}
      <Modal visible={showModal} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select an Admission</Text>

          <ScrollView horizontal>
            <View>
              {/* Table Header */}
              <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.cell, styles.headerCell]}>ID</Text>
                <Text style={[styles.cell, styles.headerCell]}>Subject ID</Text>
                <Text style={[styles.cell, styles.headerCell]}>Name</Text>
                <Text style={[styles.cell, styles.headerCell]}>Age</Text>
                <Text style={[styles.cell, styles.headerCell]}>Gender</Text>
                <Text style={[styles.cell, styles.headerCell]}>DOB</Text>
              </View>

              {/* Table Body */}
              <FlatList
                data={admissionOptions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item}) => (
                  <TouchableOpacity
                    style={[styles.row, selectedId === item.subject_id ? styles.selectedRow : {}]}
                    onPress={() => handleSelect(item.subject_id)}
                  >
                    <Text style={styles.cell}>{item.id}</Text>
                    <Text style={styles.cell}>{item.subject_id}</Text>
                    <Text style={styles.cell}>{item.patient_name}</Text>
                    <Text style={styles.cell}>{item.age}</Text>
                    <Text style={styles.cell}>{item.gender}</Text>
                    <Text style={styles.cell}>{item.dob}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </ScrollView>

          {/* Confirm Button */}
          <TouchableOpacity style={styles.closeButton} onPress={() => submit()}>
            <Text style={styles.closeButtonText}>Confirm Selection</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </View>
    </ImageBackground>
  );
};

export default Home;


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    paddingTop:10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: 10,
  },
  selectedRow: {
    backgroundColor: '#A0C4F3',
  },
  cellBorder: {
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  darkInput: {
    backgroundColor: '#444',
    color: '#fff',
    borderColor: '#777',
  },
  lightInput: {
    backgroundColor: '#fff',
    color: '#000',
    borderColor: '#ccc',
  },
  pickerContainer: {
    width: '100%',
    marginTop: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    borderRadius: 5,
  },
  darkPicker: {
    backgroundColor: '#444',
    color: '#fff',
  },
  lightPicker: {
    backgroundColor: '#fff',
    color: '#000',
  },
  viewToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
  },
  readMoreButton: {
    alignItems: 'center',
    marginVertical: 5,
  },
  readMoreText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  viewToggleButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  selectedViewToggle: {
    backgroundColor: '#2196F3',
  },
  responseContainer: {
    flex: 1,
    marginTop: 20,
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  summaryText: {
    fontSize: 16,
    textAlign: 'left',
    padding: 10,
  },
  darkBackground: {
    backgroundColor: '#202123',
  },
  lightBackground: {
    backgroundColor: '#f5f5f5',
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
  table: {
    marginTop: 10,
    flexGrow: 1, 
    flexShrink: 1,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sendButton: {
    height: 40, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15, 
    borderRadius: 5,
  },
  lightButton: {
    backgroundColor: '#A0F3D3',
  },
  darkButton: {
    backgroundColor: '#444',
  },
  activeButton: {
    backgroundColor: '#2196F3', 
  },
  disabledButton: {
    backgroundColor: '#A0C4F3', 
  },
  buttonText: {
    color: '#fff', 
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRow: {
    backgroundColor: '#ddd',
    fontWeight: 'bold',
  },
  cell: {
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 8,
    flex: 1,
    textAlign: 'left',
    width:200,
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#ddd',
    textAlign: 'center',
    width:200,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  tableContainer: {
    flexDirection: 'row',
  },
  tableWrapper: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    minWidth: '100%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  tableCell: {
    flex: 1, 
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  tableCellText: {
    textAlign: 'center',
  },
  tableHeaderCell: {
    flex: 1,
    backgroundColor: '#444',
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  oddRow: {
    backgroundColor: '#eee',
  },
  tableBodyCell: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tableBody: {
    maxHeight: 500, 
  },
  fixedWidthCell: {
    width: 300 
  },
  loader: {
    marginTop: 20,
    alignSelf: "center",
  },
});
