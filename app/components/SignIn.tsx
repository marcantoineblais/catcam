import { useEffect, useRef, useState } from "react"
import  secureLocalStorage  from  "react-secure-storage"
import "../style/SignIn.scss"

const SignIn = ({ setUser, setPage }) => {

  const [alert, setAlert] = useState(null)
  const formRef = useRef()
  const submitRef = useRef()

  useEffect(() => {
    const creds = secureLocalStorage.getItem("object")
    if (creds) {
      formRef.current.email.value = creds.email
      formRef.current.password.value = creds.password
      submitRef.current.click()
    }

    formRef.current.email.focus()
  }, [])

  const submitForm = async () => {
    const isStoreCreds = formRef.current.rememberMe.checked
    const url = 'https://catcam.source.marchome.xyz/?json=true'
    const email = formRef.current.email.value
    const password = formRef.current.password.value
    const machineID = email
    const body = {
      machineID: machineID,
      mail: email,
      pass: password
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (data.ok) {
      if (isStoreCreds) {
        secureLocalStorage.setItem("object", { email: email, password: password })
      }
      setUser(data.$user)
      setPage("live")
    } else {
      formRef.current.password.value = ""
      formRef.current.classList.add("alert")
      setAlert(<p id="alert">Invalid credentials</p>)
    }
  }

  const manageKeyUp = (e) => {
    if (e.key === "Enter") {
      submitForm()
    }
  }

  return (
    <div className="login" onKeyUp={(e) => manageKeyUp(e)}>
      <form ref={formRef} autoComplete="on">
        <h1>Login</h1>

        <label className="form-row form-email">
          <p>Email</p>
          <input name="email"></input>
        </label>

        <label className="form-row form-password">
          <p>Password</p>
          <input name="password" type="password"></input>
        </label>
        
        <label className="form-row form-checkbox">
          <p>Remember me</p>
          <input id="remember-me" name="rememberMe" type="checkbox"></input>
        </label>
        
        <div className="form-row form-btn">
          <button ref={submitRef} form="login" type="submit" onClick={() => {submitForm()}}>Submit</button>
        </div>
        { alert }
      </form>
    </div>
  )
}

export default SignIn