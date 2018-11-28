import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeTypeImage = (
  control: AbstractControl
  // [key: string] is a variable of type string of any name
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {

  const file = control.value as File;
  const fileReader = new FileReader();

  if (!control.value || typeof(control.value) === 'string') {
    return of(null);
  }
  //create observable to return from function
  const frObs = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      //attach to end of reading a file
      fileReader.addEventListener("loadend", () => {
        //subarray gets the mime type of file, those are first 4 bytes
        //https://medium.com/the-everyday-developer/detect-file-mime-type-using-magic-numbers-and-javascript-16bc513d4e1e
        const arr = new Uint8Array(<ArrayBuffer>fileReader.result).subarray(0, 4);
        let header = "";
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          //build header string with hexadecimal (16) values
          header += arr[i].toString(16);
        }
        switch (header) {
          //cases for different file types
          //https://en.wikipedia.org/wiki/List_of_file_signatures

          //PNG
          case "89504e47":
            isValid = true;
            break;

          //JPEG
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }
        if (isValid) {
          //return null (valid)
          observer.next(null);
        } else {
          observer.next({ invalidFileExtension: true });
        }
        observer.complete();
      });
      //start file reader with mime type of file
      fileReader.readAsArrayBuffer(file);
    }
  );
  return frObs;
};
