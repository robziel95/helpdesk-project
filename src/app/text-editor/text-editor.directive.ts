import { Directive, TemplateRef, ViewContainerRef, OnInit, OnChanges, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[textEditor]'
})
export class TextEditorDirective implements OnInit, OnChanges, AfterViewInit {
  context: any = null;
  divContent = '';
  textArea: string;
  divContentEditableField = null;

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
        orderedList: () => this.orderedList(),
        unOrderedList: () => this.unOrderedList(),
        clear: () => this.clear(),
        //emoji: (name: string) => console.log(name)
        emoji: (name: string) => this.emoji(name)
      },
      $implicit: this.divContent
    }
    this.viewContainer.createEmbeddedView(this.templateRef, this.context );
    this.divContentEditableField =  document.querySelector('.text-editor-container div[contenteditable]');
    //initialize div (div gets value from component), read value of this div and pass its value to input

  }

  ngOnChanges(){
    console.log('ng on changes');
  }

  ngAfterViewInit(){
    let that = this;
    Promise.resolve(null).then(() => this.context.$implicit = document.querySelector('.text-editor-container div[contenteditable]').innerHTML);
    document.querySelector('.text-editor-container div[contenteditable]').addEventListener("input", function() {
      that.divContent = this.innerHTML;
      that.context.$implicit = that.divContent;
    }, false);

  }

  emoji(name: string){
    // var selection = document.getSelection();
    // var cursorPos = selection.anchorOffset;
    // var oldContent = selection.anchorNode.nodeValue;
    // var toInsert = '<img src="backend\images\missing_user_avatar_png.png" alt="Missing user avatar">';
    // var newContent = oldContent.substring(0, cursorPos) + toInsert + oldContent.substring(cursorPos);
    // document.querySelector('.text-editor-container div[contenteditable]').innerHTML
    // console.log(newContent);

    document.getElementById('divContenteditable').focus();
    let path = `<img class="my-icons" src="backend\\images\\emoji\\png\\${name}.png" alt="Emoji ${name}">`
    document.execCommand('insertHTML', false, path );
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
