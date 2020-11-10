import React, { memo, useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useLocation } from "@reach/router"
import API from "@aws-amplify/api"

import { months, days } from "@data/date"
import certificateTypes from "@data/certificateType"
import countryCodes from "@data/countryCode"
import { getVarFromURL } from "@helpers"
import { awsConfig } from "@configs"
import { useTranslate } from "@hooks/translate"

import Label from "@components/Form/Label"
import Input from "@components/Form/Input"
import Radio from "@components/Form/Radio"
import Select from "@components/Form/Select"
import CertUpload from "@components/Form/CertUpload"
import WarningMsg from "@components/Form/WarningMsg"
import RegionAndCity from "@components/Form/RegionAndCity"

const ContactSection = ({
  handleChangeFile = () => {},
  certSrc,
  setCertSrc,
  taxIdProofSrc,
  setTaxIdProofSrc,
  ...props
}) => {
  const translate = useTranslate()
  const location = useLocation()
  const {
    register,
    watch,
    errors,
    setValue,
    setError,
    clearError,
  } = useFormContext()

  const [sponsorMsg, setSponsorMsg] = useState("")
  const [loadedUrlParams, setLoadedUrlParams] = useState(false)

  const referral_number = watch("referral_number")
  const isCountryCodeRequired = watch("country") === "OTHERS"

  useEffect(() => {
    if (typeof window !== "undefined") {
      const setData = (name, value, callback) => {
        setValue(name, value, true)
        window.localStorage.setItem(name, value)
      }
      const pathname = location.pathname
      const jointSite =
        getVarFromURL(pathname, "site") ||
        window.localStorage.getItem("joint_site")
      const referralNumber =
        getVarFromURL(pathname, "referral") ||
        window.localStorage.getItem("referral_number")
      if (jointSite) {
        setData("joint_site", jointSite)
      }
      if (referralNumber) {
        setData("referral_number", referralNumber)
        setLoadedUrlParams(true)
        window.dataLayer.push({referral_number: referralNumber});
      }
    }
  }, [])

  useEffect(() => {
    if (loadedUrlParams) {
      getSponsor()
    }
  }, [loadedUrlParams])

  const handleChangeCountryCode = countryCode => {
    const selectedOption = countryCodes.find(
      country => country.value === countryCode
    )
    const isOthers = selectedOption && selectedOption.value === "OTHERS"
    const isEmpty = countryCode === ""

    setValue("country", countryCode)
    setValue(
      "telephone_country_code",
      !isOthers && !isEmpty ? selectedOption.code : ""
    )
    clearError('telephone_country_code');
  }

  const getSponsor = async () => {
    if (
      !referral_number ||
      referral_number?.length < 9 ||
      !referral_number.match(/^\d+$/)
    ) {
      return false
    }
    let apiName = awsConfig?.API?.endpoints?.[0]?.name
    let path =
      "/member/v1/sponsor/" + referral_number + "?memberRole=DIS&market=KZ"
    let myInit = {
      headers: {},
      response: true,
    }
    setSponsorMsg("Checking Referral’s Distributor number...")
    clearError(["referral_number", "referral_number_validated"])
    setValue("referral_number_validated", 0)
    return await API.get(apiName, path, myInit)
      .then(res => {
        if (res.data?.data?.result == "N") {
          setError("referral_number", "sponsorNotExist", "Sorry, referral’s distributor number does not exist.")
          setSponsorMsg("")
        } else {
          setValue("referral_number_validated", 1)
          setSponsorMsg(
            translate("Referral’s Distributor:", {
              id: res.data?.data?.sponsorNameEng || res.data?.data?.sponsorNameChi,
            })
          )
        }
      })
      .catch(error => {
        setError("referral_number", "sponsorIdError", error.response?.data?.error?.code)
        setSponsorMsg("")
        // alert(error.response?.data?.error?.message);
      })
  }

  return (
    <div className="box-theme" id="wrapper-reg-personal-info">
      <div className="box-theme-title">{translate("Profile")}</div>

      <div className="box-theme-content">
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <Input
                ref={register({
                  required: "This is a required field.",
                  pattern: {
                    value: /^\d+$/,
                    message:
                      "Referral number or distributor ID must be number.",
                  },
                  validate: value =>
                    value.length === 9 ||
                    "Please enter a valid Referral’s Distributor number.",
                })}
                required
                hasError={
                  errors.referral_number || errors.referral_number_validated
                }
                warningMsg={
                  errors.referral_number ? errors.referral_number?.message : ""
                }
                label="Referral Distributor ID"
                name="referral_number"
                id="referral_number"
                onBlur={getSponsor}
                onChange={() => setSponsorMsg("")}
                inputOptions={{ maxLength: 9 }}
              />
              {sponsorMsg && (
                <p className="help-block input-hint">{translate(sponsorMsg)}</p>
              )}

              <input
                ref={register({
                  validate: value =>
                    value === "1" ||
                    "Sorry, referral’s distributor number does not exist.",
                })}
                name="referral_number_validated"
                id="referral-number-validated"
                type="hidden"
              />
              {referral_number && errors.referral_number_validated && (
                <WarningMsg msg={errors.referral_number_validated?.message} />
              )}

              <input ref={register} name="joint_site" type="hidden" />
            </div>
          </div>
        </div>
        <div className="customer-name row">
          <div className="form-group col-lg-4 col-md-6">
            <Input
              ref={register({
                required: "This is a required field.",
                validate: {
                  noNumberOrSymbol: value =>
                    !value.match(
                      /([%\$#\*@!^&()_+={}\\|\"\':;<>,.?\/`~0-9]+)/
                    ) || "First name cannot contain number or symbol.",
                },
              })}
              required
              hasError={errors.firstname}
              warningMsg={errors.firstname?.message}
              name="firstname"
              id="firstname"
              label="custom_first_name_label"
              title="First Name"
              inputOptions={{ maxLength: 100 }}
            />
          </div>
          <div className="form-group col-lg-4 col-md-6">
            <Input
              ref={register({
                required: "This is a required field.",
                validate: {
                  noNumberOrSymbol: value =>
                    !value.match(
                      /([%\$#\*@!^&()_+={}\\|\"\':;<>,.?\/`~0-9]+)/
                    ) || "Last name cannot contain number or symbol.",
                },
              })}
              required
              hasError={errors.lastname}
              warningMsg={errors.lastname?.message}
              name="lastname"
              id="lastname"
              label="custom_last_name_label"
              title="Last Name"
              inputOptions={{ maxLength: 100 }}
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-lg-4 col-md-6">
            <Input
              ref={register({
                validate: {
                  noNumberOrSymbol: value =>
                    !value.match(
                      /([%\$#\*@!^&()_+={}\\|\"\':;<>,.?\/`~0-9]+)/
                    ) || "First name cannot contain number or symbol.",
                },
              })}
              hasError={errors.chinese_firstname}
              warningMsg={errors.chinese_firstname?.message}
              name="chinese_firstname"
              id="chinese_firstname"
              label="Firstname in Chinese"
              title="Firstname in Chinese"
              inputOptions={{ maxLength: 30 }}
            />
          </div>
          <div className="form-group col-lg-4 col-md-6">
            <Input
              ref={register({
                validate: {
                  noNumberOrSymbol: value =>
                    !value.match(
                      /([%\$#\*@!^&()_+={}\\|\"\':;<>,.?\/`~0-9]+)/
                    ) || "Last name cannot contain number or symbol.",
                },
              })}
              hasError={errors.chinese_lastname}
              warningMsg={errors.chinese_lastname?.message}
              name="chinese_lastname"
              id="chinese_lastname"
              label="Lastname in Chinese"
              title="Lastname in Chinese"
              inputOptions={{ maxLength: 30 }}
            />
          </div>
        </div>

        {/* Gender & DOB */}
        <div className="row">
          <div className="col-md-12">
            <Label label="Gender" required />
            <div className="form-group">
              <Radio
                ref={register({ required: true })}
                required
                name="gender"
                id="male"
                value="M"
                label="Male"
                inline
              />
              <Radio
                ref={register({ required: true })}
                required
                name="gender"
                id="female"
                value="F"
                label="Female"
                inline
              />
            </div>
            {errors.gender && <WarningMsg msg="Please select your gender." />}
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <Label label="Date of Birth" forId="month" required />
            <div className="row" id="input-registration-dob">
              <div className="col-sm-4 form-group">
                <div className="dob-year">
                  <Input
                    ref={register({
                      required: "This is a required field.",
                      validate: {
                        validYear: value => {
                          const curYear = new Date().getFullYear() - 18
                          return (
                            (value >= 1900 && value <= curYear) ||
                            translate("Please enter a valid year.", {
                              year: curYear,
                            })
                          )
                        },
                      },
                    })}
                    required
                    name="year"
                    id="year"
                    title={translate("Year")}
                    placeholder="Year"
                    inputOptions={{ maxLength: 4, inputMode: "numeric" }}
                    hasError={errors.year}
                    warningMsg={errors.year?.type === 'validYear' ? errors.year?.message : ''}
                  />
                </div>
              </div>
              <div className="col-sm-4 form-group">
                <div className="dob-month">
                  <Select
                    ref={register({ required: true })}
                    required
                    hasError={errors.month}
                    name="month"
                    id="month"
                    title={translate("Month")}
                    placeholder="Month"
                    options={months}
                    // value={month}
                    warningMsg=""
                  />
                </div>
              </div>
              <div className="col-sm-4 form-group">
                <div className="dob-day">
                  <Select
                    ref={register({ required: true })}
                    required
                    hasError={errors.day}
                    warningMsg={errors.day?.message}
                    name="day"
                    id="day"
                    title={translate("Day")}
                    placeholder="Day"
                    options={days}
                    // value={day}
                  />
                </div>
              </div>
            </div>
            {(errors.year?.type === 'required' || errors.month?.type === 'required' || errors.day?.type === 'required') && (
              <WarningMsg msg="This date is a required value." />
            )}
            {errors.year?.type === "ageNotValid" && <WarningMsg msg={errors.year?.message}/>}
          </div>
        </div>

        {/* Cert */}
        <div className="row">
          <div className="col-lg-4 col-md-5 col-sm-6 form-group">
            <Label label="Certificate Type" forId="certificate_type" required />
            <Select
              ref={register({ required: true })}
              required
              hasError={errors.certificate_type}
              name="certificate_type"
              id="certificate_type"
              title={translate("Certificate Type")}
              noPlaceholder
              options={certificateTypes}
              onChange={(e) => e.target?.value !== 'IC' && setValue('is_pe', false)}
              // value={certificate_type}
            />
          </div>
          <div className="col-lg-6 col-md-7 col-sm-12 form-group">
            <Input
              ref={register({
                required: "This is a required field.",
                pattern: {
                  value: /^[a-zA-Z0-9]+$/,
                  message: "Certificate number cannot contain symbols.",
                },
              })}
              required
              hasError={errors.certificate_number}
              warningMsg={errors.certificate_number?.message}
              name="certificate_number"
              id="certificate_number"
              label="Identity card / Passport"
              title={translate("Identity card / Passport")}
              inputOptions={{ maxLength: 25 }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 form-group">
            <div id="wrapper-reg-certificate-upload" className="clearfix">
              <CertUpload
                ref={register}
                name="certificate_src"
                id="certificate_src"
                placeholder="certificate_placeholder"
                value={certSrc}
                onChange={file =>
                  handleChangeFile(file, "certificate_src", setCertSrc)
                }
                hasError={errors.certificate_src}
              />
            </div>
          </div>
        </div>

        <hr />

        {/* Email & Phone */}
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <Input
                ref={register({
                  pattern: {
                    value: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
                    message:
                      "Please enter a valid email address. For example johndoe@domain.com.",
                  },
                })}
                hasError={errors.secondary_email}
                warningMsg={errors.secondary_email?.message}
                name="secondary_email"
                id="secondary_email"
                label="Email"
                title={translate("Email")}
                inputOptions={{ maxLength: 40 }}
              />
            </div>
          </div>
          <div className="col-md-8">
            <div className="row wrapper-tel-input">
              <Label
                labelClass="col-12"
                forId="country"
                label="Mobile Number"
                required
              />
              <div className="col-md-5 col-12 form-group">
                <Select
                  ref={register({ required: true })}
                  required
                  hasError={errors.country}
                  name="country"
                  id="country"
                  title="Mobile Number Country Code"
                  placeholder="Country Code"
                  options={countryCodes}
                  // value={country}
                  onChange={handleChangeCountryCode}
                />
              </div>
              <div className="col-md-3 col-4 form-group">
                <Input
                  ref={register({
                    required:
                      isCountryCodeRequired &&
                      "Please enter a valid country code",
                    pattern: {
                      value: /^\d+$/,
                      message: "Please enter a valid country code",
                    },
                  })}
                  required={isCountryCodeRequired}
                  hasError={errors.telephone_country_code}
                  warningMsg={errors.telephone_country_code?.message}
                  name="telephone_country_code"
                  title="Mobile Number Country Code"
                  placeholder="Country Code"
                  inputOptions={{
                    maxLength: 5,
                    type: "tel",
                    // pattern: '[0-9]*',
                    readOnly: !isCountryCodeRequired,
                    inputMode: "numeric",
                  }}
                />
              </div>
              <div className="col-md-4 col-8 form-group">
                <Input
                  ref={register({
                    required: "This is a required field.",
                    validate: {
                      validPhoneNumber: value => {
                        const country = watch("country")
                        let isValid = true
                        if (country === "HK") {
                          isValid =
                            value.match(/^\d{8}$/) ||
                            value.match(/^\d{4}-?\d{4}$/)
                        } else if (country === "MO") {
                          isValid =
                            value.match(/^6\d{7}$/) ||
                            value.match(/^6\d{3}-?\d{4}$/)
                        } else if (country === "OTHERS") {
                          isValid = value.match(/^(\d+-?)+\d+$/)
                        } else {
                          isValid = value.match(/^(\d+-?)+\d+$/)
                        }
                        return isValid || "Please enter a valid phone number"
                      },
                    },
                  })}
                  required
                  hasError={errors.telephone}
                  name="telephone"
                  title={translate("Mobile Number")}
                  placeholder="Mobile Number"
                  inputOptions={{
                    maxLength: 15,
                    type: "tel",
                    // pattern: '[0-9]*',
                    inputMode: "numeric",
                  }}
                  warningMsg={errors.telephone?.message}
                />
              </div>
              <p className="help-block col-12">{translate("telephone_hint")}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="row">
          <div className="col-md-8 form-group">
            <Input
              ref={register({ required: true })}
              required
              hasError={errors.street1}
              name="street1"
              label="Address"
              id="street1"
              title={`${translate("Contact Address")} 1`}
              placeholder={`${translate("Contact Address")} 1`}
              inputClass="form-control  required-entry"
              inputOptions={{ maxLength: 130 }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 form-group">
            <Input
              ref={register}
              hasError={errors.street2}
              name="street2"
              title={`${translate("Contact Address")} 2`}
              placeholder={`${translate("Contact Address")} 2`}
              inputClass="form-control"
              inputOptions={{ maxLength: 140 }}
            />
          </div>
        </div>

        {/* Region & City */}
        <div className="row">
          <div className="col-md-10">
            <RegionAndCity />
            <div className="row">
              <div className="col-sm-6 form-group">
                <Input
                  ref={register}
                  hasError={errors.postcode}
                  name="postcode"
                  id="postcode"
                  label="ZIP/Postal Code"
                  title={translate("ZIP/Postal Code")}
                  inputOptions={{ maxLength: 10 }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 form-group">
                <Input
                  ref={register}
                  hasError={errors.iin}
                  name="iin"
                  id="iin"
                  label="IIN"
                  title={translate("IIN")}
                  inputOptions={{ maxLength: 20 }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 form-group">
                <div id="wrapper-reg-certificate-upload" className="clearfix">
                  <CertUpload
                    ref={register}
                    name="tax_id_proof_src"
                    id="tax_id_proof_src"
                    placeholder="tax_id_placeholder"
                    value={taxIdProofSrc}
                    onChange={file =>
                      handleChangeFile(
                        file,
                        "tax_id_proof_src",
                        setTaxIdProofSrc
                      )
                    }
                    hasError={errors.tax_id_proof_src}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ContactSection);
