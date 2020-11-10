import React, { memo } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslate } from "@hooks/translate"

import Label from "@components/Form/Label"
import Checkbox from '@components/Form/Checkbox';
import CertUpload from "@components/Form/CertUpload"

const PeSection = ({
    handleChangeFile = () => {},
    setPeCertSrc, peCertSrc,
    ...props}) => {

  const translate = useTranslate();
  const {
    register,
    watch,
  } = useFormContext();

  const isPe = watch('is_pe');
  const certificate_type = watch('certificate_type');

  return (
    <div className="box-theme" id="wrapper-reg-documents">
      <div className="registration-signature-box">
        <div
          className="box-theme-title"
          style={!isPe ? { borderBottom: "none" } : {}}
        >
          <Checkbox
            id="pe-checkbox"
            name="is_pe"
            value="1"
            label="I am a Personal Entrepreneur"
            ref={register}
            disabled={certificate_type === "PPT"}
          />
        </div>
        {isPe && (
          <div className="box-theme-content">
            {/* Upload Cert */}
            <div className="row">
              <div
                className="col-md-12 mb-3"
                dangerouslySetInnerHTML={{
                  __html: translate("PE Description"),
                }}
              />
              <div className="col-md-4 form-group">
                <Label label="PE Certificate" />
              </div>
              <div className="col-md-8 form-group">
                <div id="wrapper-reg-certificate-upload" className="clearfix">
                  <CertUpload
                    ref={register}
                    name="pe_certificate_src"
                    id="pe_certificate_src"
                    placeholder="pe_certificate_placeholder"
                    value={peCertSrc}
                    onChange={file =>
                      handleChangeFile(file, "pe_certificate_src", setPeCertSrc)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(PeSection);
