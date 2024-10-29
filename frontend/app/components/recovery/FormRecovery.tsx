'use client'
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useJwt } from "react-jwt"
import { useRouter, useSearchParams } from "next/navigation";
import { RESET_PASSWORD, VERIFY_CODE } from "@/app/lib/graphql/recovery";
import { ResetPassword, ResetPasswordVariables, VerifyCode, VerifyCodeVariables } from "@/app/lib/types/typesGraphql";
import { toastCustom } from "../ui/toasts";
import { Toaster } from "react-hot-toast";

type DecodedToken = {
	recoveryCode: string,
	email: string
}

const FormRecovery = () => {
	const router = useRouter()
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
	const { decodedToken, isExpired } = useJwt<DecodedToken>(token || '')

  const [otp, setOtp] = useState(decodedToken?.recoveryCode || '');
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stage, setStage] = useState<"otp" | "password">("otp");
  const [error, setError] = useState("");

  const [verifyOtp, {error: errorCode}] = useMutation<VerifyCode, VerifyCodeVariables>(VERIFY_CODE, {
    onCompleted: (data) => {
      if (data.verifyCode.response === 'OK') {
        setStage("password");
        setError("");
      } else {
        setError("Código OTP incorrecto");
      }
    },
  })

  const [resetPassword, {error: errorReset}] = useMutation<ResetPassword, ResetPasswordVariables>(RESET_PASSWORD);

  const handleVerifyOtp = async () => {
    if (otp.length !== 8) {
			toastCustom({text: 'El código debe tener 8 caracteres', variant: 'error', duration:3000})
      return;
    }

    try {
      await verifyOtp({ variables: {
				code: otp,
				email: decodedToken?.email as string
			} });
    } catch (err) {
			toastCustom({text: 'Error al verificar codigo', variant: 'error', duration:3000})
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
			toastCustom({text: 'Las contraseñas no coinciden', variant: 'error', duration:3000})
      return;
    }

    try {
      await resetPassword({ variables: {
				email: decodedToken?.email as string,
				password: newPassword
			} });
			router.push('/login')
			toastCustom({text: 'Contraseña cambiada correctamente', variant: 'success', duration:4000})
    } catch (err) {
			toastCustom({text: 'Error al cambiar la contraseña', variant: 'error', duration:3000})
    }
  }

  return (
		<section className="flex flex-col items-center gap-5">
			<h2 className='text-xl md:text-3xl font-semibold text-center'>
				{stage === 'otp'
				? 'Enviar correo de confirmacion'
				: 'Agrega tu contraseña nueva'
			}
			</h2>
			<div className="text-lg font-medium p-5 rounded-2xl ring-1 ring-seagreen-950 dark:ring-white flex flex-col gap-5 w-[300px] bg-white dark:bg-transparent shadow-small shadow-white/25">
				{stage === "otp" && (
					<>
						<div className="flex flex-col gap-1">
							<label htmlFor='code'>Codigo de verificacion</label>
							<Input
								type="text"
								placeholder="Ingresa el código"
								name="code"
								id="code"
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
								maxLength={8}
								className={`${
									error ? "ring-red-500" : "ring-gray-300"
								}`}
							/>
							<p className="font-light text-sm">Ingresa el codigo enviado a tu correo.</p>
						</div>
						<Button
							type='submit'
							color='primary'
							variant='solid'
							size='lg'
							marginX='auto'
							shape='md'
							onClick={handleVerifyOtp}
						>
							Verificar OTP
						</Button>
					</>
				)}

				{stage === "password" && (
					<>
						<div className="flex flex-col gap-1">
							<label htmlFor='password'>Nueva contraseña</label>
							<Input
								type="password"
								name="password"
								id="password"
								placeholder="Nueva contraseña"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label htmlFor='confirmPassword'>Confirma contraseña</label>
							<Input
								type="password"
								name="confirmPassword"
								id="confirmPassword"
								placeholder="Confirmar nueva contraseña"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								/>
						</div>
						
						<Button
							type='submit'
							color='primary'
							variant='solid'
							size='lg'
							marginX='auto'
							shape='md'
							onClick={handleResetPassword}
						>
							Cambiar contraseña
						</Button>
						{error && <p className="text-red-500 text-sm">{error}</p>}
					</>
				)}
			</div>
			<Toaster/>
		</section>
  );
};

export default FormRecovery;
