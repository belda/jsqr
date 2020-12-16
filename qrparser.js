var thefile;
var spayd;
var found_qr_callback;

function parseQRfile(file_field, callback, preview=null) {
    var canvas = $("<canvas id='qr-canvas' style='height: 100%; width:100%'/>");
    if (preview != null) {
        preview.append(canvas);
    }
    if (callback) found_qr_callback = callback;

    $(file_field).change(function(event){
        console.info("File field changed", event.target.files[0]);
        thefile = event.target.files[0];
        if (thefile.type == "application/pdf") {
            var reader = new FileReader();
            reader.readAsArrayBuffer(thefile);
            reader.onload = async function (ev) {
                var binary_data = ev.target.result;
                var loadingTask = pdfjsLib.getDocument(binary_data);
                loadingTask.promise.then(function (pdf) {
                    // Fetch the first page.
                    pdf.getPage(1).then(function (page) {
                        var scale = 1.5;
                        var viewport = page.getViewport({scale: scale,});
                        // Prepare canvas using PDF page dimensions.
                        // var canvas = document.getElementById('the-canvas');
                        var context = canvas[0].getContext('2d');
                        canvas[0].height = viewport.height;
                        canvas[0].width = viewport.width;
                        // Render PDF page into canvas context.
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport,
                        };
                        var rendered = page.render(renderContext);
                        rendered.promise.then(processImage);
                    });
                });
            }
        } else {
            processImage();
        }
    });

}


function processImage(event) {
    spayd = qrcode.decode();
    console.log(spayd);
    if (found_qr_callback) {
        found_qr_callback(parseSpayed(spayd));
    }
}

function parseSpayed(input){
    if (input.startsWith("SPD*1.0*")) {
        var out = {};
        input = input.replace("SPD*1.0*", "");
        var splits = input.split("*")
        for (var i =0; i< splits.length; i++) {
            var os = splits[i].split(":");
            out[os[0]] = os[1];
        }
        out["amount"] = out["AM"];
        out["vs"] = out["X-VS"];
        out["ss"] = out["X-SS"];
        out["ks"] = out["X-KS"];
        out["message"] = out["MSG"];
        out["currency"] = out["CC"];
        out["bank_account"] = out["ACC"].substr(8)
        out["bank_number"] = out["ACC"].substr(4,4)

        if (out["RF"]) {
            out["invoice_number"] = out["RF"]
        } else if (thefile && thefile.name) {
            var pattern =  /([A-Z]{0,3}[0-9]{6,20})/g
            var res = pattern.exec(thefile.name);
            if (res) {
                out["invoice_number"] = res[1];
            }
        }
        return out;
    }
}