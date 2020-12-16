# jsqr
Library that reads pdf invoice in browser and returns payment details from QR Platba (SPAYD).

## What it is
Simple set of scripts that enable you to read PDF file in browser and look for QR code
in the document containing payment information in the SPAYD format (see https://qr-platba.cz/ ).

It is a usefull tool for web based accounting systems.

## Examples

Include required libraries
```html
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.228/pdf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.2.228/build/pdf.worker.js"></script>
<script src="https://rawgit.com/sitepoint-editors/jsqrcode/master/src/qr_packed.js"></script>
<script src="qrparser.js"></script>
```

And the magic code that reads the input file in browser and renders preview and upon callback puts the values
in fields
```javascript
function response(data) {
    console.log(data);
    $("#id_bank_account").val(data["bank_account"]);
    $("#id_bank_number").val(data["bank_number"]);
}

$(document).ready(function(){
		parseQRfile($("#id_document"), response, $("#preview"));

});

```



![alt text](https://raw.githubusercontent.com/belda/jsqr/main/screenshots/1.png)
![alt text](https://raw.githubusercontent.com/belda/jsqr/main/screenshots/2.png)

