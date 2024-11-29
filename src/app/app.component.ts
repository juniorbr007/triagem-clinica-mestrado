import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from './firebase.service';
import * as tf from '@tensorflow/tfjs';
import { Patient } from './Patient/patient.model';  // Importe a interface Patient corretamente

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // Definindo o formulário reativo
  form: FormGroup;
  pacientes: Patient[] = [];  // Array de pacientes com tipo Patient
  documents: Patient[] = [];  // Lista de documentos do tipo Patient

  // Conjunto de sintomas que pode ser ajustado conforme necessário
  sintomasSet = new Set([
    "dor de cabeça", "febre", "tosse", "dor no peito", "falta de ar", "suor excessivo", 
    "dor abdominal", "náusea", "dificuldade para respirar", "tosse seca", "fadiga", "calafrios", 
    "diarreia", "dor nas articulações"
  ]);

  data: any[] = [];
  model: any;

  showForm: boolean = false;
  title = 'triagem-clinica';

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      idade: [null, [Validators.required, Validators.min(0)]],
      sintomas: [[], Validators.required],
      diagnostico: [{ value: '', disabled: true }, Validators.required],  // Diagnóstico desabilitado
      triagem: [{ value: 'Aguardando', disabled: true }, Validators.required]  // Triagem desabilitada
    });
  }

  ngOnInit(): void {
    // Carregar os documentos do Firebase
    this.firebaseService.getDocuments('triagem').subscribe(
      (data: Patient[]) => {
        this.documents = data;  // Armazena os dados recebidos
        console.log('Documentos carregados: ', data);
        this.prepareDataForTraining(data);  // Prepara os dados para o treinamento
      },
      (error: any) => {
        console.error('Erro ao carregar documentos: ', error);
      }
    );
  }

  // Método para adicionar um documento
  addDocument() {
    const newData: Patient = {  // Agora 'newData' é do tipo Patient
      nome: 'Novo paciente',
      idade: 0,  // Adicionando idade para completar os dados
      sintomas: [],  // Adicionando sintomas como um array vazio
      diagnostico: 'Desconhecido',  // Adicionando um valor para o campo 'diagnostico'
      triagem: 'Aguardando',  // Adicionando triagem com o status 'Aguardando'
    };

    this.firebaseService.addDocument('triagem', newData)
      .then(() => {
        console.log('Documento adicionado com sucesso!');
        this.loadDocuments();
      })
      .catch((error) => {
        console.error('Erro ao adicionar documento: ', error);
      });
  }

  // Método para carregar documentos
  loadDocuments() {
    this.firebaseService.getDocuments('triagem').subscribe(
      (data: Patient[]) => {
        this.documents = data;
      },
      (error: any) => {
        console.error('Erro ao carregar documentos após adicionar: ', error);
      }
    );
  }

  // Método para lidar com o envio do formulário
  async onSubmit() {
    if (this.form.invalid) {
      console.error('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
  
    const formData: Patient = this.form.value;
    console.log('Dados do formulário:', formData);
  
    // Obter os sintomas do formulário
    const sintomas = formData.sintomas;
  
    // Prever o diagnóstico com os sintomas fornecidos
    const prediction = await this.predictSymptoms(sintomas);
  
    // Mapear a previsão para um diagnóstico
    const diagnostico = this.mapLabelToDiagnostico(prediction);
  
    // Preencher o campo Diagnóstico e Triagem com os valores previstos
    this.form.get('diagnostico')?.setValue(diagnostico);
    this.form.get('triagem')?.setValue('Em Análise');  // Exemplo, pode ser baseado em lógica de triagem
  
    // Enviar os dados para o Firebase
    this.firebaseService.addDocument('triagem', formData)
      .then(() => {
        console.log('Dados enviados com sucesso!');
        // Atualizar lista de documentos
        this.loadDocuments();
      })
      .catch((error) => {
        console.error('Erro ao enviar dados:', error);
      });
  }

  mapLabelToDiagnostico(prediction: any): string {
    const diagnosticoMap: { [key: number]: string } = {
      0: 'Gripe',
      1: 'Infarto',
      2: 'Gastrite',
      3: 'COVID-19',
      4: 'Malária',
      5: 'Dengue',
      6: 'Pneumonia',
      7: 'Enxaqueca',
      8: 'Gastroenterite'
    };
    const maxPredictionIndex = prediction.indexOf(Math.max(...prediction)); // Pega o índice do valor mais alto
    
  return diagnosticoMap[maxPredictionIndex] || 'Desconhecido';
  }

  // Função para preparar os dados para o treinamento do modelo
  prepareDataForTraining(data: Patient[]) {  // Mudado para o tipo Patient
    const inputs: number[][] = [];  // Definindo tipo explícito como matriz de números
    const labels: number[] = [];    // Definindo tipo explícito como array de números

    data.forEach((patient: Patient) => {  // Alterado para tipo Patient
      const sintomasBinary = Array.from(this.sintomasSet).map(sintoma => 
        patient.sintomas.includes(sintoma) ? 1 : 0
      );
      inputs.push(sintomasBinary);
      labels.push(this.mapDiagnosticoToLabel(patient.diagnostico));
    });

    this.trainModel(inputs, labels);  // Chama a função para treinar o modelo
  }

  // Função para mapear o diagnóstico para uma label numérica
  mapDiagnosticoToLabel(diagnostico: string): number {
    const diagnosticoMap: { [key: string]: number } = {
      "Gripe": 0,
      "Infarto": 1,
      "Gastrite": 2,
      "COVID-19": 3,
      "Malária": 4,
      "Dengue": 5,
      "Pneumonia": 6,
      "Enxaqueca": 7,
      "Gastroenterite": 8
    };
    return diagnosticoMap[diagnostico] || -1;  // Retorna -1 se o diagnóstico não for encontrado
  }

  // Função para treinar o modelo com os dados preparados
  async trainModel(inputs: number[][], labels: number[]) {
    const inputTensor = tf.tensor2d(inputs);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 32, inputShape: [inputs[0].length], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    await model.fit(inputTensor, labelTensor, {
      epochs: 50,
      batchSize: 10
    });

    this.model = model;  // Salva o modelo treinado
    console.log("Modelo treinado!");
  }

  // Função para fazer a previsão com o modelo treinado
  async predictSymptoms(sintomas: string[]) {
    if (!this.model) {
      console.error("Modelo não treinado.");
      return;
    }
  
    const sintomasBinary = Array.from(this.sintomasSet).map(sintoma => 
      sintomas.includes(sintoma) ? 1 : 0
    );

    console.log('Sintomas Binários:', sintomasBinary);
  
    const prediction = await this.model.predict(tf.tensor2d([sintomasBinary])).data();
    console.log("Previsão:", prediction);
  
    return prediction;
  }
  
}
