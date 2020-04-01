import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AyahService } from "../ayah.service";
import { Ayah } from "../models/ayah";
import { SuraIndex } from '../models/suraIndex';
import { Options } from 'ng5-slider';

@Component({
  selector: 'mq-ayah',
  templateUrl: './ayah.component.html',
  styleUrls: ['./ayah.component.css']
})
export class AyahComponent implements OnInit {
  //  @Input() ayah: Ayah
  show = false;
  rowIndex: number;
  hideVerses = false;
  filteredVerses: Ayah[] = [];
  allVerses: Ayah[] = [];
  suraIndexes: SuraIndex[] = [];
  errorMsg: string;
  selectedSuraName: string;
  totalAyat: number;

  suraForm = this.fb.group({
    suraId: [1],
    fromVerse: [1, [Validators.required, Validators.min(1)]],
    toVerse: [7, [Validators.required, Validators.min(1)]],
    // hideVerses: [false],
  })

  constructor(
    private fb: FormBuilder,
    private ayahService: AyahService) { }


  ngOnInit() {
    this.getAyat()
    this.getSuraIndexes()
    this.openNav()
  }

  toggle(rowIndex: number) {

    this.show = !this.show
    this.rowIndex = rowIndex


    // console.log(rowIndex)
  }

  getAyat() {

    this.ayahService.getAyat()
      .subscribe(
        _ayat => this.allVerses = _ayat,
        error => this.errorMsg = <any>error,
        () => {
          this.getSuraIndexes()
          this.getFilteredVerses()
          // console.log(data.fromVerse + ' to ' + data.toVerse)
        }
      )

  }


  getFilteredVerses() {
    // this.getAyatTotals()
    var formValues = this.suraForm.getRawValue();

    // console.log(formValues)
    this.filteredVerses = []
    this.filteredVerses = this.allVerses.filter(el => (el.suraId == formValues.suraId) && el.verseId >= Number(formValues.fromVerse) && el.verseId <= parseInt(formValues.toVerse))
    this.selectedSuraName = this.filteredVerses[0].suraName
    this.totalAyat = Number(this.suraIndexes.filter(x => x.suraId == formValues.suraId).map(x => x.totalAya))

  }


  suraChanged() {
    // this.getAyatTotals()
    var formValues = this.suraForm.getRawValue();
    this.totalAyat = Number(this.suraIndexes.filter(x => x.suraId == formValues.suraId).map(x => x.totalAya))
    //  console.log(formValues)
    this.filteredVerses = []
    this.filteredVerses = this.allVerses.filter(el => (el.suraId == formValues.suraId) && el.verseId >= Number(formValues.fromVerse) && el.verseId <= this.totalAyat)
    this.selectedSuraName = this.filteredVerses[0].suraName 
    this.suraForm.controls['toVerse'].setValue(this.totalAyat)
    this.suraForm.controls['fromVerse'].setValue(1)
  }


  // getSelectedSura(event: Event) {
  //   let selectedOption = event.target['options'];
  //   console.log(event)
  // }

  getSuraIndexes() {
    this.ayahService.getSuraIndexes()
      .subscribe(
        _data => this.suraIndexes = _data,
        error => this.errorMsg = <any>error,
        () => {
          // this.getAyatNumbers();
          // console.log(this.suraIndexes)

        }
      )
  }

  toggleHideVerses() {
    // var formValues = this.suraForm.getRawValue();
    // this.suraForm.controls['hideVerses'].setValue(!formValues.hideVerses)
    this.hideVerses = !this.hideVerses
    // console.log(this.hideVerses)
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "100%";
  }

  /* Set the width of the side navigation to 0 */
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }


  // handleLookup(suraId: number) { //, verseId: number
  //   this.selectedSura = suraId
  //   console.log(suraId);

  //   this.ayat = this.ayat.filter(s => s.suraId === this.selectedSura)//s.verseId === verseId &&
  //   if (suraId.toString().trim() == '') {
  //     this.getAyat();
  //   }
  // }

}
