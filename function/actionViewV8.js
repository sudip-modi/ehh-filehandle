
class ActionView {
    constructor(viewModel, parent) {
     //   console.log("Request for new View ", viewModel, parent);
        this._actionView = new Entity(viewModel, parent);
        //  console.log(" new View ", this._actionView.entity);
    }
//     static setAttribute(input, key, value) {
//         input.key = value;
//         return input;
//     }
//     appendChild(input,target){
//         target.appendChild('input');
//         return input;
//     }
    replaceChild([input, target]) {
    //console.log("replaceChild",input,target)
        var newChild = new Entity(input, document.createElement('div'));
//        console.log("here", newChild.entity, "target", target.entity.innerHTML);
        target.innerHTML = newChild.entity.innerHTML;
        return target;
     }
     static newEntity(input,element){
         var newEntity = new Entity(input,element);
         return newEntity;
     }
    /**
     * Validtions to be added.
   * This method is used for adding InnerHTML to DOM Elements
   * @param {HTMLElement} DOMElement - HTML DOM Element to add HTML to
   * @param {HTMLElement} inputElem - HTML Input Element to be added into DOMElement
   */ 
    static addInnerText(inputElem,target){
      target.innerText = inputElem;
    }
    static addInnerHTML(inputElem,target){

    target.innerHTML = inputElem;
    }
    static GDriveFileSupportedInEditor(FileName){
        console.log("GDrive File Name :- " + FileName);
        if(FileName.includes('.html')||FileName.includes('.css')||FileName.includes('.js')||FileName.includes('.json')||FileName.includes('.txt')){
            return true;
        }else{
            return false;
        }
    }
    static async viewForm(event,type){
    event.preventDefault();
    var formElement = document.getElementById('viewForm');
    ActionView.addInnerHTML('',formElement);
    var json = {};
     if( type == 'invoiceForm'){
        json = invoiceJSON;
        // var params = JSON.parse(JSON.stringify({'Form':'invoiceForm'}));
        // var response = await HttpService.fetchRequest(HttpService.urlBuilder(scriptURL,params),HttpService.requestBuilder("GET"));
       // if(response){
            // var invoiceArray = response.output;
            // json = mutate.arr2Object(invoiceArray,invoiceArray[0],{});
            // console.log(json);
      //  }else{
            
      //  }
       json['content']['invoice']['article']['meta']['tr3']['td']['span']['textContent'] = uid();
    }else if(type == 'import'){
       json = importfromSheet;
    }else if(type == 'GDrive_Server'){
       json = GetFileFromGDrive;
    }else if(type == 'RssReader'){
        json = RssReaderJSON;
    }else if(type == 'actionStories'){
        json = GetActionStoriesJSON;
    }
    ActionView.addInnerHTML('',document.getElementById('inlineContent'));
    var Form = new Entity(json,{});
    var ViewInstance = new ActionView(json,formElement);
    var EventInstance = new ActionEvent(editor,window);
    var ControllerInstance = new ActionController(Form,ViewInstance,EventInstance);
    }
    static async viewModal(event){
        event.preventDefault();
        // var HTMLjson = Entity.toJSON(document.getElementById('inlineContent'),copy2HTMLModel);
        // var inputjson = {};inputjson['editor'] = HTMLjson;
        // var array =mutate.TWODARRAY(mutate.Obj2(inputjson, []));
        // console.log(array);
        // exportToSheetparamsJSON['array'] = array;
        var json = exportToSheet;
        var modal = document.getElementById('data');
        modal.style.display = 'block';
        ActionView.newEntity(json,modal);
    }
    static async closeModal(){
        var modal = document.getElementById('data');
        modal.style.display = 'none';
        ActionView.addInnerHTML('',modal);
    }
}
/**
 * @file get/set caret position and insert text
 * @author islishude
 * @license MIT
 */
 class Caret extends ActionView {
    /**
     * get/set caret position
     * @param {HTMLColletion} target
     */
    constructor(target) {
        this.isContentEditable = target && target.contentEditable
        this.target = target
        //console.log("CaretCreated ",target.tagName);
    }


    static moveCaret(win, charCount) {
        var sel, range;
        if (win.getSelection) {
            // IE9+ and other browsers
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var textNode = sel.focusNode;
                var newOffset = sel.focusOffset + charCount;
                sel.collapse(textNode, Math.min(textNode.length, newOffset));
            }
        } else if ((sel = win.document.selection)) {
            // IE <= 8
            if (sel.type != "Control") {
                range = sel.createRange();
                range.move("character", charCount);
                range.select();
            }
        }
    }

  static getCaretCoordinates() {
    let x = 0,
        y = 0;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
        const selection = window.getSelection();
        if (selection.rangeCount !== 0) {
            const range = selection.getRangeAt(0).cloneRange();
            range.collapse(true);
            const rect = range.getClientRects()[0];
            if (rect) {
                x = rect.left;
                y = rect.top;
            }
        }
    }
    return { x, y };
     }
     getCaretCharacterOffsetWithin(element) {
         var caretOffset = 0;
         var doc = element.ownerDocument || element.document;
         var win = doc.defaultView || doc.parentWindow;
         var sel;
         if (typeof win.getSelection != "undefined") {
             sel = win.getSelection();
             if (sel.rangeCount > 0) {
                 var range = win.getSelection().getRangeAt(0);
                 var preCaretRange = range.cloneRange();
                 preCaretRange.selectNodeContents(element);
                 preCaretRange.setEnd(range.endContainer, range.endOffset);
                 caretOffset = preCaretRange.toString().length;
             }
         } else if ((sel = doc.selection) && sel.type != "Control") {
             var textRange = sel.createRange();
             var preCaretTextRange = doc.body.createTextRange();
             preCaretTextRange.moveToElementText(element);
             preCaretTextRange.setEndPoint("EndToEnd", textRange);
             caretOffset = preCaretTextRange.text.length;
         }
         return caretOffset;
     }
     pasteHtmlAtCaret(html) {
         var sel, range;
         if (window.getSelection) {
             // IE9 and non-IE
             sel = window.getSelection();
             if (sel.getRangeAt && sel.rangeCount) {
                 range = sel.getRangeAt(0);
                 range.deleteContents();

                 // Range.createContextualFragment() would be useful here but is
                 // non-standard and not supported in all browsers (IE9, for one)
                 var el = document.createElement("div");
                 el.innerHTML = html;
                 var frag = document.createDocumentFragment(), node, lastNode;
                 while ((node = el.firstChild)) {
                     lastNode = frag.appendChild(node);
                 }
                 range.insertNode(frag);

                 // Preserve the selection
                 if (lastNode) {
                     range = range.cloneRange();
                     range.setStartAfter(lastNode);
                     range.collapse(true);
                     sel.removeAllRanges();
                     sel.addRange(range);
                 }
             }
         } else if (document.selection && document.selection.type != "Control") {
             // IE < 9
             document.selection.createRange().pasteHTML(html);
         }
     }
}

    
