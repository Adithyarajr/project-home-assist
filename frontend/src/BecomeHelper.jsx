import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { cleanPhone, isValidPhone } from './phone'
import Avatar from './Avatar'

const ALL_ROLES = [
  'Cook',
  'Housekeeper',
  'Babysitter',
  'Dishwasher',
  'Gardener',
  'Nanny for Elderly',
  'Nanny for Pets',
  'Driver',
  'Caretaker',
]

const emptyForm = {
  name: '',
  phone: '',
  city: '',
  area: '',
  role: '',
  experience: '',
  salary: '',
}

function BecomeHelper({ user, onNavigate }) {
  const [existing, setExisting] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [photoFile, setPhotoFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const userId = user?.id

  useEffect(() => {
    if (!userId) return

    async function loadExisting() {
      const { data } = await supabase
        .from('helpers')
        .select('id, name, phone, photo_url, role')
        .eq('user_id', userId)
        .order('id')
      setExisting(data ?? [])
    }

    loadExisting()
  }, [userId])

  const takenRoles = (existing ?? []).map((l) => l.role)
  const availableRoles = ALL_ROLES.filter((r) => !takenRoles.includes(r))
  const roleValue = availableRoles.includes(form.role) ? form.role : availableRoles[0]

  const first = existing && existing.length > 0 ? existing[0] : null
  const isSecond = !!first
  const limitReached = existing !== null && existing.length >= 2
  const phoneOk = isSecond || isValidPhone(form.phone)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === 'phone' ? cleanPhone(value) : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setMessage('Please log in before listing your services.')
      return
    }

    if (limitReached) {
      setMessage('You can have at most 2 listings per account.')
      return
    }

    if (!phoneOk) {
      setMessage('Please enter a valid 10-digit mobile number.')
      return
    }

    const years = Number(form.experience)
    const pay = Number(form.salary)

    if (!Number.isInteger(years) || years < 0 || years > 50) {
      setMessage('Experience must be a whole number between 0 and 50 years.')
      return
    }

    if (!Number.isInteger(pay) || pay < 1000 || pay > 100000) {
      setMessage('Salary must be a whole number between ₹1,000 and ₹100,000 per month.')
      return
    }

    setSubmitting(true)
    setMessage('')

    let photoUrl = first ? first.photo_url : null

    if (!first && photoFile) {
      const fileName = `${Date.now()}-${photoFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('helper-photos')
        .upload(fileName, photoFile)

      if (uploadError) {
        setMessage('Photo upload failed. Please try again.')
        setSubmitting(false)
        console.error(uploadError)
        return
      }

      const { data: urlData } = supabase.storage
        .from('helper-photos')
        .getPublicUrl(fileName)

      photoUrl = urlData.publicUrl
    }

    const { data, error } = await supabase
      .from('helpers')
      .insert({
        name: first ? first.name : form.name,
        phone: first ? first.phone : form.phone,
        location: `${form.area}, ${form.city}`,
        role: roleValue,
        experience: `${years} years`,
        salary: String(pay),
        photo_url: photoUrl,
        verified: false,
        user_id: user.id,
      })
      .select('id, name, phone, photo_url, role')
      .single()

    setSubmitting(false)

    if (error) {
      console.error(error)
      const text = error.message || ''
      if (text.includes('at most 2')) {
        setMessage('You can have at most 2 listings per account.')
      } else if (text.includes('already have a listing')) {
        setMessage('You already have a listing for this role.')
      } else if (
        text.includes('Experience must') ||
        text.includes('Salary must') ||
        text.includes('Phone number must')
      ) {
        setMessage(text)
      } else {
        setMessage('Something went wrong. Please try again.')
      }
      return
    }

    setExisting((prev) => [...(prev ?? []), data])
    setForm(emptyForm)
    setPhotoFile(null)
    setMessage('Profile submitted! We will review it shortly.')
  }

  if (!user) {
    return (
      <div className="auth-container">
        <h2>List Your Services</h2>
        <p>Please log in to list your services.</p>
      </div>
    )
  }

  if (existing === null) {
    return (
      <div className="auth-container">
        <p>Loading...</p>
      </div>
    )
  }

  if (limitReached) {
    return (
      <div className="auth-container">
        <h2>List Your Services</h2>
        {message && <p>{message}</p>}
        <p>
          You've reached the limit of 2 listings per account. You can see them
          on your Dashboard.
        </p>
        {onNavigate && (
          <button className="primary-btn" onClick={() => onNavigate('bookings')}>
            Go to Dashboard
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="auth-container">
      <h2>List Your Services</h2>

      {isSecond ? (
        <div className="listing-note">
          <Avatar name={first.name} url={first.photo_url} className="mini-photo" />
          <span>
            Your second listing uses the same name, phone number and photo as
            your first one ({first.name}, {first.phone}).
          </span>
        </div>
      ) : (
        <p className="dashboard-sub">
          You can list up to 2 services, for example Cook and Driver.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {!isSecond && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              inputMode="numeric"
              name="phone"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              required
            />
            {form.phone.length > 0 && !phoneOk && (
              <p className="field-error">Enter a valid 10-digit mobile number.</p>
            )}
          </>
        )}

        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="area"
          placeholder="Area"
          value={form.area}
          onChange={handleChange}
          required
        />

        <select name="role" value={roleValue} onChange={handleChange}>
          {availableRoles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <input
          type="number"
          inputMode="numeric"
          name="experience"
          placeholder="Years of experience (0 to 50)"
          min="0"
          max="50"
          step="1"
          value={form.experience}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          inputMode="numeric"
          name="salary"
          placeholder="Expected monthly salary in ₹ (1000 to 100000)"
          min="1000"
          max="100000"
          step="1"
          value={form.salary}
          onChange={handleChange}
          required
        />

        {!isSecond && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
          />
        )}

        <button
          className="primary-btn"
          type="submit"
          disabled={submitting || !phoneOk}
        >
          {submitting ? 'Submitting...' : 'Submit Profile'}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  )
}

export default BecomeHelper