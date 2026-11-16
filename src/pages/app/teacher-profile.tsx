import { Link, useNavigate } from "react-router"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import goBack from "../../assets/goback-another-purple.svg"
import proffyLogo from "../../assets/proffy-logo.svg"
import attentionIcon from "../../assets/attention.svg"
import backgroundImg from "../../assets/background.svg"

import { InputCustom } from "../../components/input-custom"
import { TextArea } from "../../components/text-area"
import { Select } from "../../components/select"

import {
  SUBJECT_OPTIONS,
  WEEK_DAY_OPTIONS,
  formatWhatsappMask,
} from "../../constants/teacher-options"
import {
  getTeacherProfile,
  saveTeacherProfile,
} from "../../services/teacher-storage"

const scheduleItemSchema = z
  .object({
    week_day: z.string().min(1, "Selecione o dia da semana."),
    from: z.string().regex(/^\d{2}:\d{2}$/, "Informe o horário inicial."),
    to: z.string().regex(/^\d{2}:\d{2}$/, "Informe o horário final."),
  })
  .refine(({ from, to }) => from < to, {
    message: "O horário final deve ser posterior ao inicial.",
    path: ["to"],
  })

const teacherProfileSchema = z.object({
  firstName: z.string().trim().min(1, "Informe seu nome."),
  lastName: z.string().trim().min(1, "Informe seu sobrenome."),
  email: z.string().trim().email("Informe um e-mail válido."),
  whatsapp: z
    .string()
    .trim()
    .regex(
      /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
      "Informe um WhatsApp válido. Ex: (47) 98897-1458"
    ),
  biography: z
    .string()
    .trim()
    .min(1, "Informe sua biografia.")
    .max(300, "A biografia pode ter no máximo 300 caracteres."),
  subject: z.string().min(1, "Selecione a matéria."),
  cost: z.coerce
    .number({ error: "Informe o custo da sua hora-aula." })
    .positive("O custo deve ser maior que zero."),
  schedule: z
    .array(scheduleItemSchema)
    .min(1, "Mantenha ao menos um horário disponível."),
})

type TeacherProfileFormData = z.infer<typeof teacherProfileSchema>
type TeacherProfileFormInput = z.input<typeof teacherProfileSchema>

export function TeacherProfile() {
  const navigate = useNavigate()
  const storedProfile = getTeacherProfile()

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeacherProfileFormInput, unknown, TeacherProfileFormData>({
    resolver: zodResolver(teacherProfileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: storedProfile.firstName,
      lastName: storedProfile.lastName,
      email: storedProfile.email,
      whatsapp: storedProfile.whatsapp,
      biography: storedProfile.biography,
      subject: storedProfile.subject || "Geografia",
      cost: storedProfile.cost ? String(storedProfile.cost) : "20",
      schedule:
        storedProfile.schedule.length > 0
          ? storedProfile.schedule
          : [
              { week_day: "2", from: "12:00", to: "18:00" },
              { week_day: "3", from: "08:00", to: "18:00" },
            ],
    },
  })

  const {
    fields: scheduleItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "schedule",
  })

  const watchedFirstName = watch("firstName")
  const watchedLastName = watch("lastName")
  const watchedSubject = watch("subject")

  function addNewScheduleItem() {
    append({ week_day: "", from: "", to: "" })
  }

  function handleWhatsappChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = formatWhatsappMask(e.target.value)
    setValue("whatsapp", masked, { shouldValidate: true, shouldDirty: true })
  }

  function handleSaveProfile(data: TeacherProfileFormData) {
    saveTeacherProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      whatsapp: data.whatsapp,
      biography: data.biography,
      subject: data.subject,
      cost: data.cost,
      schedule: data.schedule,
    })

    navigate("/give-classes/register-completed")
  }

  return (
    <div className="w-full min-h-screen items-center flex flex-col align-top bg-background antialiased overflow-x-hidden">
      {/* Header Superior */}
      <div className="w-full flex flex-row justify-center items-center bg-dark-purple h-[64px] px-6">
        <header className="flex w-full justify-between items-center max-w-7xl">
          <Link to="/">
            <img src={goBack} alt="Voltar" className="w-8 h-12" />
          </Link>
          <h1 className="text-text-purple-base font-archivo-semibold text-base">
            Meu perfil
          </h1>
          <img src={proffyLogo} alt="Proffy" className="w-12 h-4" />
        </header>
      </div>

      {/* Área de Destaque do Professor (Banner Roxo com Background Geométrico) */}
      <div
        className="w-full flex flex-col items-center justify-center bg-purple h-[420px] bg-no-repeat bg-center px-6"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="flex flex-col items-center -mt-8">
          <div className="relative">
            <img
              src={storedProfile.avatarUrl}
              alt={`${watchedFirstName} ${watchedLastName}`}
              className="w-44 h-44 rounded-full object-cover border-4 border-purple"
            />
            <button
              type="button"
              title="Alterar foto de perfil"
              className="absolute bottom-1 right-1 w-12 h-12 rounded-full bg-green hover:bg-green-dark transition flex items-center justify-center cursor-pointer shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          <h2 className="font-archivo-bold text-3xl text-white mt-6">
            {watchedFirstName} {watchedLastName}
          </h2>
          <span className="font-poppins-regular text-xl text-text-purple-base mt-1">
            {watchedSubject || "Matéria não selecionada"}
          </span>
        </div>
      </div>

      {/* Card Branco Central */}
      <main className="flex flex-col w-full max-w-4xl justify-center my-auto bg-white border-1 border-gray-lines-in-white rounded-lg -mt-[3.2rem] overflow-hidden pt-16 mb-16 shadow-sm">
        <form onSubmit={handleSubmit(handleSaveProfile)} noValidate>
          {/* Seção 1: Seus dados */}
          <fieldset className="flex flex-col items-center mx-16">
            <legend className="flex w-full items-center justify-between pb-6 mb-4 font-archivo-semibold text-2xl text-text-title border-b-1 border-gray-lines-in-white">
              Seus dados
            </legend>

            <div className="grid grid-cols-2 w-full gap-8">
              <div className="flex flex-col w-full mt-6">
                <InputCustom
                  name="firstName"
                  label="Nome"
                  labelColor="text-text-complement"
                  bgColor="bg-white-shape"
                  register={register}
                  error={errors.firstName}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col w-full mt-6">
                <InputCustom
                  name="lastName"
                  label="Sobrenome"
                  labelColor="text-text-complement"
                  bgColor="bg-white-shape"
                  register={register}
                  error={errors.lastName}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-5 w-full gap-8">
              <div className="flex flex-col w-full mt-6 col-span-3">
                <InputCustom
                  name="email"
                  label="E-mail"
                  type="email"
                  labelColor="text-text-complement"
                  bgColor="bg-white-shape"
                  register={register}
                  error={errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col w-full mt-6 col-span-2">
                <InputCustom
                  name="whatsapp"
                  label="Whatsapp"
                  placeholder="( ) _ ____ ____"
                  labelColor="text-text-complement"
                  bgColor="bg-white-shape"
                  register={register}
                  onChange={handleWhatsappChange}
                  error={errors.whatsapp}
                />
                {errors.whatsapp && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.whatsapp.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col w-full max-w-full mt-6">
              <TextArea
                name="biography"
                label="Biografia"
                labelColor="text-text-complement"
                bgColor="bg-white-shape"
                maxLength={300}
                register={register}
                error={errors.biography}
                spanLabel="(Máximo 300 caracteres)"
              />
              {errors.biography && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.biography.message}
                </p>
              )}
            </div>
          </fieldset>

          {/* Seção 2: Sobre a aula */}
          <fieldset className="flex flex-col items-center justify-between mx-16 mt-16">
            <legend className="flex w-full items-center justify-between pb-6 font-archivo-semibold text-2xl text-text-title border-b-1 border-gray-lines-in-white">
              Sobre a aula
            </legend>

            <div className="grid grid-cols-5 w-full gap-8">
              <div className="flex flex-col w-full mt-8 col-span-3">
                <Select
                  name="subject"
                  label="Matéria"
                  labelColor="text-text-complement"
                  bgColor="bg-white-shape"
                  register={register}
                  error={errors.subject}
                  optionDefault="Selecione qual você quer ensinar"
                  options={SUBJECT_OPTIONS}
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col w-full mt-8 col-span-2">
                <InputCustom
                  name="cost"
                  label="Custo da sua hora por aula"
                  labelColor="text-text-complement"
                  bgColor="bg-white-shape"
                  placeholder="R$ 20,00"
                  type="number"
                  min="0.01"
                  step="0.01"
                  register={register}
                  error={errors.cost}
                />
                {errors.cost && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.cost.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Seção 3: Horários disponíveis */}
          <fieldset className="flex flex-col items-center justify-between mx-16 mt-16">
            <legend className="flex w-full items-center justify-between pb-6 font-archivo-semibold text-2xl text-text-title border-b-1 border-gray-lines-in-white">
              Horários disponíveis
              <button
                type="button"
                className="text-base font-archivo-semibold text-purple cursor-pointer hover:text-dark-purple transition"
                onClick={addNewScheduleItem}
              >
                + Novo horário
              </button>
            </legend>

            {scheduleItems.map((scheduleItem, index) => (
              <div key={scheduleItem.id} className="w-full">
                <div className="grid grid-cols-4 w-full gap-8 mb-4">
                  <div className="flex flex-col mt-8 col-span-2">
                    <Select
                      name={`schedule.${index}.week_day`}
                      label="Dia da semana"
                      labelColor="text-text-complement"
                      bgColor="bg-white-shape"
                      register={register}
                      error={errors.schedule?.[index]?.week_day}
                      optionDefault="Selecione o dia"
                      options={WEEK_DAY_OPTIONS}
                    />
                    {errors.schedule?.[index]?.week_day && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.schedule[index]?.week_day?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col w-full mt-8 col-span-1">
                    <InputCustom
                      name={`schedule.${index}.from`}
                      label="Das"
                      labelColor="text-text-complement"
                      bgColor="bg-white-shape"
                      type="time"
                      register={register}
                      error={errors.schedule?.[index]?.from}
                    />
                    {errors.schedule?.[index]?.from && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.schedule[index]?.from?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col w-full mt-8 col-span-1">
                    <InputCustom
                      name={`schedule.${index}.to`}
                      label="Até"
                      labelColor="text-text-complement"
                      bgColor="bg-white-shape"
                      type="time"
                      register={register}
                      error={errors.schedule?.[index]?.to}
                    />
                    {errors.schedule?.[index]?.to && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.schedule[index]?.to?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center w-full gap-8 pb-4 mt-2">
                  <span className="flex-1 border-t-1 border-gray-lines-in-white" />
                  <button
                    type="button"
                    disabled={scheduleItems.length === 1}
                    className="font-archivo-semibold text-sm text-red-500 cursor-pointer hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    onClick={() => remove(index)}
                  >
                    Excluir horário
                  </button>
                  <span className="flex-1 border-t-1 border-gray-lines-in-white" />
                </div>
              </div>
            ))}
          </fieldset>

          {/* Rodapé do Card */}
          <div className="flex w-full px-16 mt-10 bg-white-shape items-center justify-between py-8 border-t-1 border-gray-lines-in-white">
            <div className="flex gap-4 items-center">
              <img
                src={attentionIcon}
                alt="Aviso importante"
                className="w-8 h-8"
              />
              <p className="font-poppins-regular text-xs text-purple">
                Importante!
                <br />
                <span className="font-poppins-regular text-xs text-text-complement">
                  Preencha todos os dados corretamente.
                </span>
              </p>
            </div>

            <button
              type="submit"
              className="flex gap-4 items-center bg-green hover:bg-green-dark cursor-pointer transition py-4 px-10 rounded-lg font-archivo-semibold text-base text-white"
            >
              Salvar cadastro
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}