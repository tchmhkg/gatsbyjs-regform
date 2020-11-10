import React, { memo, forwardRef } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslate } from "@hooks/translate"

import Signature from "@components/Form/Signature"

const SignatureSection = forwardRef(
  ({ signatureToImage = () => {}, signatureSrc, ...props }, ref) => {
    const translate = useTranslate()
    const { register, errors } = useFormContext()

    return (
      <div className="box-theme" id="wrapper-reg-signature">
        <div className="registration-signature-box">
          <div className="box-theme-title" id="signature-title">{translate("Signature")}</div>
          <div className="box-theme-content">
            <Signature
              ref={ref}
              inputRef={register({ required: "This is a required field." })}
              onEnd={signatureToImage}
              name="signature_src"
              hasError={errors.signature_src}
              warningMsg={errors.signature_src?.message}
              signatureSrc={signatureSrc}
            />
          </div>
        </div>
      </div>
    )
  }
)

export default memo(SignatureSection)
