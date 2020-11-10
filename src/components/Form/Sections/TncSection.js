import React, { memo } from "react"
import { useFormContext } from "react-hook-form"

import Tnc from "@components/Form/Tnc"
import WarningMsg from "@components/Form/WarningMsg"

const TncSection = () => {
  const { register, errors } = useFormContext()

  return (
    <div className="form-group">
      <div className="checkbox-theme style-formal">
        <input
          type="checkbox"
          id="tnc-checkbox"
          name="tnc"
          value="1"
          ref={register({ required: true })}
        />
        <label htmlFor="tnc-checkbox" id="tnc-label" className="required">
          <Tnc />
        </label>
      </div>
      {errors.tnc && <WarningMsg />}
    </div>
  )
}

export default memo(TncSection)
