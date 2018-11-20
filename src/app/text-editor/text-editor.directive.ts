import { Directive, TemplateRef, ViewContainerRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[textEditor]'
})
export class TextEditorDirective implements OnInit {
  context: any = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

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
      }
    }
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
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
