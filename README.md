# Daimofuu JS Form Lib

## 🚀 Overview

**Daimofuu Form Lib** is a lightweight, standalone Vanilla JavaScript library for building and rendering web forms. Designed with simplicity in mind, it offers an intuitive GUI-based form editor alongside an advanced mode for greater flexibility and enhanced functionality. I have created this to be used on my personal projects, but sharing is caring so I have made a clean source copy available for coders like you to check out, maybe this can help you in something, Dai - means Big and "mofuu" is meant as word-play for fluffy, a Nihongo words for the name.

---

## 📦 Features

- 🌟 **Feature 1**: GUI Based editor, for Non-code use case.
- ⚡ **Feature 2**: JSON based Form Configurations and Rendering.
- 🛠️ **Feature 3**: Advance Editor mode for Advance Users.
- 🔌 **Feature 4**: Bonus Features such as Built-in File Uploader functions, Signature Pad and other essential features.

---

## 🛠️ Installation

The Sample is Provided on the ***index.html,***

with the following breakdown: 

### CSS Styling:

We separated common styles into separate files for easier customization, such as the coloring for all the colors, and typography for our fonts. There are also some styles that I use from other project, such us for the buttons and labels, the lib can work without them, but might break in some cases not tested yet.

```html
<!-- Complementary Styles For Colors, Fonts and Icons -->
<link rel="stylesheet" href="css/coloring.css">
<link rel="stylesheet" href="css/font-awesome.css">
<link rel="stylesheet" href="css/typography.css">
<link rel="stylesheet" href="css/daimofuu_buttons.css">
<link rel="stylesheet" href="css/daimofuu_fancylabel.css">

<!-- Main Style for Form Lib -->
<link rel="stylesheet" href="css/daimofuu_formeditor.css">

<!-- Advance Editor Styling -->
<link rel="stylesheet" href="css/codemirror.css">
<link rel="stylesheet" href="css/dracula.css">
```

### **Javascript Files**

There are some Complementary scripts used, such as the signature pad, and codemirror (used on advanced editor). The main file is the ***form\_libs.js***, it contains all the logic for this lib.

```html
<!-- Complementary Libraries -->
<script src="js/lib/signature_pad.min.js"></script>
<!-- For Code Mirror Lib -->
<script src="js/lib/codemirror.js"></script>
<script src="js/mode/javascript/javascript.js"></script>

<!-- Main Code of this Library -->
<script src="js/form_libs.js"></script>
<script src="js/lib/daimofuu_fancylabel.js"></script>
```

---

## 💖 Usage

Here's a quick example to get you started:

Sample is already provided on the index, let's break down each of it:

### Loading Forms from JSON 

If you want to load forms from a saved object or from a script file, we will put the form object into the ***formDatas*** variable, containing "forms" and "groups" object inside it, which is as follows: 

```javascript
formDatas = {
    "forms": [
        {
            "type": "header",
            "value": "Header text",
            "id": "undefined_0",
            "index": 0
        },
        {
            "type": "text",
            "value": "",
            "label": "Text",
            "id": "text_1",
            "index": 0,
            "onchange": "hello()",
        }
    ],
    "groups": []
}
```

The example object above will make a header field and a text box, with a custom object "onchange" event, which gets called after we change the value of this field.

### Initialization Example:

After initializing the formData, we can now call the "loadForms" function, which will render all the forms we have on our object.

***loadForms() params:***

- **readonly**: A boolean parameter that determines if the forms should be rendered in read-only mode. Default is `false`.
- **editor**: A boolean parameter to enable or disable the form editor interface. Default is `true`.
- **showAc**: A boolean parameter for toggling additional features like "Copy Value" Button. Default is `false`.
- **renewId**: A boolean parameter that indicates whether to regenerate unique IDs for form fields. Default is `false`.

```javascript
//init and Render the Forms we have
loadForms(0,1,0,0); //we load the form with an editor interface active
addFancyPlaceholder();
loadEvents(); //Force Pre-load Events of each form fields, if neccesary
```

### Using the GUI Based Editor

If we are using the form editor interface functions, the html DOM elements for editing are required to be present on your current page, which is provided on the index. If not, the editing interface would simply fail to load, but the form rendering is not affected. So long as the "main container" is present.

Each field types have their own functions and editor interface, such as the Select option, and the Special types like the Table fields editor.

You can save the form configuration by turning the "***formDatas***" object into a string. Then put it to your saving methods.

### Using as Fill-Up Mode

Another main use case for this library is the fill-up mode. In this mode, all form fields are rendered on the page, allowing users to input their data. To use this mode effectively, call the ***loadForms()*** function with the editor parameter set to `false` to avoid any unexpected behavior. Since the editor interfaces (DOM elements) are not needed during form filling, they do not have to be present on the page. This ensures that users cannot modify the form structure while filling out the fields. 

### Getting the Values from Forms

to get the Value from each fields, you can get them using the id of each form like: 

```javascript
_("field_id").value;
//or using the builtin function
formMaker.retriveFormInput();
```

The ***formMaker.retriveFormInput();*** function will return all values in an object; headers are not included since they are not expected to have values.  

### Loading Values into the Fields

To ***load values*** into the fields, 
you can use the : ***setValues***() function 

which accepts the params:
***setValues(id, values, attributes)***

- **id**: The unique identifier for the field where the value will be set.
- **values**: The data to be assigned to the field, typically as a string or array, depending on the field type.
- **attributes**: Additional attributes, used to tell the type of fields we are putting it in. we just put the reference from the formDatas directly.

We can write a loop that goes through all fields and put each of the value data. 

```javascript
let valueObjectDatas = { }; //Values object

for(each of formDatas.forms){
    if(each.type == 'header'){
        continue;
    };

    let DataToPut = valueObjectDatas; //Values object

    try{
        if(each.type == 'date'){
            let parsedDate = new Date(DataToPut[each.id]);
            _(each.id).value = parsedDate.toISOString().split('T')[0];
        }else{
            setValues(each.id, DataToPut[each.id], each);
        }
    }catch(e){
        //console.log(e);
    }
}

addFancyPlaceholder(); 
loadEvents();
loadListedEvents();
```

The ***valueObjectDatas*** are the object we got from generated data of **formMaker.retriveFormInput();**

More Docu Coming ...
