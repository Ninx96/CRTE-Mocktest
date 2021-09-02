import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap/dist/js/bootstrap.esm";
import $ from "jquery";

const CustomAlert = ({ visible, title, message, onClose }) => {
  return (
    <div>
      <div
        class="align-content-center"
        id="mdl_alert"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                {title}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">{message}</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => onClose(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => onClose(true)}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
