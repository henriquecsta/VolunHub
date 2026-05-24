const toneClassNames = {
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-mist-300 bg-white/80 text-slate-600',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
};

function ProjectSubscriptionFeedback({
  errorMessage,
  isAuthenticated,
  isChecking,
  isSubmitting,
  isVolunteer,
  projectStatus,
  subscription,
  successMessage,
}) {
  const feedback = getFeedback({
    errorMessage,
    isAuthenticated,
    isChecking,
    isSubmitting,
    isVolunteer,
    projectStatus,
    subscription,
    successMessage,
  });

  if (!feedback) {
    return null;
  }

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClassNames[feedback.tone]}`}>
      <p className="text-sm font-semibold text-ink-900">{feedback.title}</p>
      <p className="mt-1 text-sm">{feedback.description}</p>
    </div>
  );
}

function getFeedback({
  errorMessage,
  isAuthenticated,
  isChecking,
  isSubmitting,
  isVolunteer,
  projectStatus,
  subscription,
  successMessage,
}) {
  if (!isAuthenticated) {
    return {
      tone: 'info',
      title: 'Entre para participar',
      description: 'Use uma conta de voluntário para enviar sua inscrição neste projeto.',
    };
  }

  if (!isVolunteer) {
    return null;
  }

  if (projectStatus !== 'ATIVO') {
    return {
      tone: 'warning',
      title: 'Inscrições indisponíveis',
      description: 'Este projeto não está aceitando novas inscrições no momento.',
    };
  }

  if (errorMessage) {
    return {
      tone: 'error',
      title: 'Não foi possível concluir a inscrição',
      description: errorMessage,
    };
  }

  if (isSubmitting) {
    return {
      tone: 'info',
      title: 'Enviando inscrição',
      description: 'Estamos registrando sua participação com segurança.',
    };
  }

  if (isChecking) {
    return {
      tone: 'info',
      title: 'Verificando sua inscrição',
      description: 'Estamos conferindo se você já participa deste projeto.',
    };
  }

  if (subscription) {
    return {
      tone: 'success',
      title: successMessage ? 'Inscrição enviada' : 'Você já está inscrito',
      description: successMessage || `Status atual: ${subscription.statusLabel}.`,
    };
  }

  return null;
}

export default ProjectSubscriptionFeedback;
