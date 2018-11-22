import { Directive, TemplateRef, ViewContainerRef, Input, OnInit, OnChanges, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[textEditor]'
})
export class TextEditorDirective implements OnInit, OnChanges, AfterViewInit {
  context: any = null;
  divContent = 'whatever';
  textArea: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private elementRef: ElementRef) { }

  ngOnInit(){
    this.context = {
      controller: {
        undo: () => this.undo(),
        redo: () => this.redo(),
        bold: () => this.bold(),
        italic: () => this.italic(),
        underline: () => this.underline(),
        alignCenter: () => this.alignCenter(),
        alignLeft: () => this.alignLeft(),
        alignRight: () => this.alignRight(),
        alignJustify: () => this.alignJustify(),
        orderedList: () => this.orderedList(),
        unOrderedList: () => this.unOrderedList(),
        clear: () => this.clear()
      },
      $implicit: this.divContent
    }
    this.viewContainer.createEmbeddedView(this.templateRef, this.context );
  }

  ngOnChanges(){
    console.log('ng on changes');
  }

  ngAfterViewInit(){
    //let element = document.querySelector('div[contenteditable]');
    //let myDiv = this.elementRef.nativeElement.querySelector('div[contenteditable]');
    //console.log(this);
    let that = this;
    document.querySelector('.text-editor-container div[contenteditable]').addEventListener("input", function() {
      that.divContent = this.innerHTML;
    }, false);
  }

  undo(){
    document.execCommand('undo', false, null);
  }

  redo(){
    document.execCommand('redo', false, null);
  }

  bold(){
    document.execCommand('bold', false, null);
  }

  italic(){
    document.execCommand('italic', false, null);
  }

  underline(){
    document.execCommand('underline', false, null);
  }

  alignCenter(){
    document.execCommand('justifycenter', false, null);
  }

  alignLeft(){
    document.execCommand('justifyleft', false, null);
  }

  alignRight(){
    document.execCommand('justifyright', false, null);
  }

  alignJustify(){
    document.execCommand('justifyFull', false, null);
  }

  orderedList(){
    document.execCommand('insertorderedlist', false, null);
  }

  unOrderedList(){
    document.execCommand('insertunorderedlist', false, null);
  }

  clear(){
    document.execCommand('removeFormat', false, null);
  }
}
