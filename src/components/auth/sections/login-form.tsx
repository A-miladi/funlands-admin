"use client";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input, InputGroup, FormField } from "@/components/ui/input";
import type { LoginModel } from "../use-login-model";
type Props = Pick<LoginModel, "t" | "email" | "setEmail" | "password" | "setPassword" | "visible" | "setVisible" | "remember" | "setRemember" | "status" | "setStatus" | "submit">;
export function LoginForm({ t, email, setEmail, password, setPassword, visible, setVisible, remember, setRemember, status, setStatus, submit }: Props) {
    return (<form onSubmit={submit} className="mt-[30px] flex flex-col gap-5">
                <FormField htmlFor="email" label={t("email")}>
                  
                  <InputGroup>
                    <Icon name="mail"/>
                    <Input id="email" name="email" type="email" dir="ltr" autoComplete="username" placeholder="you@example.com" required value={email} onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
        }} aria-invalid={status === "error"} aria-describedby={status === "error" ? "login-error" : undefined}/>
                  </InputGroup>
                </FormField>
                <FormField htmlFor="password" label={t("password")}>
                  
                  <InputGroup>
                    <Icon name="lock"/>
                    <Input id="password" name="password" type={visible ? "text" : "password"} dir="ltr" autoComplete="current-password" placeholder={t("passwordPlaceholder")} required value={password} onChange={(e) => {
            setPassword(e.target.value);
            setStatus("idle");
        }} aria-invalid={status === "error"} aria-describedby={status === "error" ? "login-error" : undefined}/>
                    <Button variant="unstyled" className="grid shrink-0 cursor-pointer place-items-center p-1" type="button" onClick={() => setVisible(!visible)} aria-label={t(visible ? "hidePassword" : "showPassword")} aria-pressed={visible}>
                      <Icon name="eye"/>
                    </Button>
                  </InputGroup>
                </FormField>
                <label className="flex cursor-pointer items-center gap-2 self-start text-[11px] text-(--muted) [&_input]:size-[15px] [&_input]:accent-primary-500">
                  <Input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}/>
                  {t("remember")}
                </label>
                {status === "error" && (<p className="text-xs leading-6 text-error-500" role="alert" id="login-error">
                    {t("error")}
                  </p>)}
                <Button type="submit" loading={status === "loading"} className="ltr:[&>svg]:rotate-180">{status === "loading" ? t("loading") : <>{t("submit")}<Icon name="arrow"/></>}</Button>
              </form>);
}
