import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Patient } from './Patient/patient.model';  // Importe a interface Patient

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore) {}

  // Método para buscar documentos com id
getDocuments(collectionName: string): Observable<any[]> {
  return this.firestore.collection(collectionName).snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data() as Patient;
      const id = a.payload.doc.id;
      return { id, ...data };  // Retorna o id junto com os dados
    }))
  );
}

  // Método para adicionar documento
  addDocument(collectionName: string, data: Patient): Promise<void> {
    const id = this.firestore.createId();  // Criando um ID único para o novo documento
    return this.firestore.collection(collectionName).doc(id).set(data);
  }

  // Método para adicionar dados sintéticos (exemplo de pacientes)
  addSyntheticData(): void {
    const data: Patient[] = [
      { nome: "Paciente 1", idade: 35, sintomas: ["dor de cabeça", "febre", "tosse"], diagnostico: "Gripe", triagem: "Média prioridade" },
      { nome: "Paciente 2", idade: 42, sintomas: ["dor no peito", "falta de ar", "suor excessivo"], diagnostico: "Infarto", triagem: "Alta prioridade" },
      { nome: "Paciente 3", idade: 25, sintomas: ["dor abdominal", "náusea", "febre"], diagnostico: "Gastrite", triagem: "Baixa prioridade" },
      { nome: "Paciente 4", idade: 60, sintomas: ["dificuldade para respirar", "tosse seca"], diagnostico: "COVID-19", triagem: "Alta prioridade" },
      { nome: "Paciente 5", idade: 50, sintomas: ["cansaço", "febre", "calafrios"], diagnostico: "Malária", triagem: "Média prioridade" },
      { nome: "Paciente 6", idade: 45, sintomas: ["dor nas articulações", "febre", "calafrios"], diagnostico: "Dengue", triagem: "Média prioridade" },
      { nome: "Paciente 7", idade: 60, sintomas: ["dificuldade para respirar", "tosse", "febre"], diagnostico: "Pneumonia", triagem: "Alta prioridade" },
      { nome: "Paciente 8", idade: 30, sintomas: ["fadiga", "dor de cabeça", "náusea"], diagnostico: "Enxaqueca", triagem: "Baixa prioridade" },
      { nome: "Paciente 9", idade: 55, sintomas: ["dificuldade para respirar", "febre", "calafrios"], diagnostico: "COVID-19", triagem: "Alta prioridade" },
      { nome: "Paciente 10", idade: 40, sintomas: ["diarreia", "febre", "dor abdominal"], diagnostico: "Gastroenterite", triagem: "Média prioridade" }
    ];

    // Usar Promise.all para garantir que todos os documentos sejam adicionados
    const addPromises = data.map(patient => this.addDocument('triagem', patient));

    // Aguardar todas as promessas serem resolvidas
    Promise.all(addPromises)
      .then(() => console.log("Dados sintéticos adicionados com sucesso!"))
      .catch((error) => console.error("Erro ao adicionar dados sintéticos:", error));
  }
}
