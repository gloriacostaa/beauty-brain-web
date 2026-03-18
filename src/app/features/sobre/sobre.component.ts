import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobre.component.html',
  styleUrl: './sobre.component.scss'
})
export class SobreComponent {
  timeline = [
    {
      ano: '2022',
      titulo: 'A ideia começa',
      desc: 'Identificamos a necessidade de modernizar a gestão de salões de beleza com tecnologia acessível.'
    },
    {
      ano: '2023',
      titulo: 'Desenvolvimento',
      desc: 'Primeiros protótipos criados com foco na experiência do cliente e facilidade de uso para gestores.'
    },
    {
      ano: '2024',
      titulo: 'Lançamento Beta',
      desc: 'Primeiros salões parceiros adotam a plataforma e validam o conceito com clientes reais.'
    },
    {
      ano: '2025',
      titulo: 'BeautyBrain',
      desc: 'Lançamento oficial com todas as funcionalidades: agendamento, catálogo, aprovações e agenda completa.'
    },
  ];

  stats = [
    {num: '500+', label: 'Clientes ativos'},
    {num: '12', label: 'Salões parceiros'},
    {num: '98%', label: 'Satisfação'},
    {num: '4.9★', label: 'Avaliação média'},
  ];
}
