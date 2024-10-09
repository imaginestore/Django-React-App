import { Link } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";

// jodit-editor
import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
//import DecoupledEditor from "@ckeditor/ckeditor5-editor-decoupled";

function AddRichText() {
  // jodit editor code start
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const CONFIG = {
    uploader: {
      url: "/api/upload",
    },
    filebrowser: {
      ajax: {
        url: "/api/file/files",
      },
      uploader: {
        url: "/api/upload",
      },
    },
  };
  // jodit editor code end

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <TeacherSidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Add Content in Rich Text Format</h5>
            <div className="card-body">
              <form>
                <div class="mb-3">
                  <label for="chaptertitle" class="form-label">
                    Title
                  </label>
                  <input type="text" class="form-control" id="chaptertitle" />
                </div>
                <div class="mb-3">
                  <label for="rtfield" class="form-label">
                    CKEditor
                  </label>
                  <CKEditor editor={ClassicEditor} />
                </div>

                <div class="mb-3">
                  <label for="exampleFormControlTextarea1" class="form-label">
                    Content
                  </label>
                  {/* <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  ></textarea> */}
                  <JoditEditor
                    ref={editor}
                    value={content}
                    onChange={(newContent) => setContent(newContent)}
                  />
                </div>
                <button type="submit" class="btn btn-primary">
                  Submit
                </button>
              </form>
              {content}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AddRichText;
