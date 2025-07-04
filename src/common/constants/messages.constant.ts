/**
 * @readonly
 * @type {Object}
 * Este objeto contém mensagens que serão usadas pelas exceções fornecidas pelo framework NestJS
 */
export const Messages = {
  SERVER_ERROR: 'Algo deu errado. Por favor, tente novamente mais tarde.',
  TOKEN_EXPIRED:
    'Seu token está malformado ou expirado, faça login novamente para obter um novo',
  INVALID_REQUEST: 'Solicitação inválida.',
  NOT_FOUND: "Registro não existe",
  RECORD_EXPIRED: "Registro não existe ou expirou.",
  BAD_LOGIN_REQUEST: 'E-mail ou senha inválidos.',
  USER_BLOCKED: 'Usuário bloqueado pelo administrador.',
  INVALID_CREDENTIAL:
    'Falha no login. Por favor, verifique suas credenciais e tente novamente.',
  PASSWORDS_MISMATCH: 'As senhas não correspondem.',
  DUPLICATE_USER: 'Usuário com essas credenciais já existe.',
  DUPLICATE_RECORD: 'Este registro já existe.',
  RECORD_UPDATED: 'Registro do usuário atualizado.',
  PASSWORD_UPDATED: 'Senha atualizada com sucesso.',
  FOREIGN_ID_MISSING: 'ID do registro está faltando ou incorreto.',
  DOMAIN_HEADER_MISSING: 'Cabeçalho de domínio está faltando.',
  INVALID_PASSWORD: 'Senha inválida.',
  INVALID_DOMAIN: 'Domínio inválido.',
  ROLE_PERMISSION_ERROR:
    'Função não pode ser criada sem permissões. Dica: as permissões que você está anexando não existem',
  PERMISSION_OWNERSHIP_ERROR:
    'A permissão que você está tentando excluir não pertence a você',
  ROLE_ERROR: "As funções que você está tentando atribuir não existem",
  CONFLICTING_ROLE_REMOVE:
    'A função/funções que você está tentando desatribuir já foram desatribuídas',
  CONFLICTING_ROLE_ADD:
    'A função/funções que você está tentando atribuir já foram atribuídas',
  INVALID_UUID: 'UUID inválido.',
  ACCOUNT: {
    ID_MISSING: 'ID da conta está faltando',
    NOT_FOUND: 'Conta não existe',
    ALREADY_EXISTS: 'A conta com este subdomínio já existe.',
    ACTIVE: 'A conta está Ativa.',
    INACTIVE: 'A conta está Inativa.',
  },
  ROLE: {
    ALREADY_EXISTS: 'Função com este nome já existe.',
    ROLE_SUCCESSFULLY_DELETED: 'Função Excluída com Sucesso',
    NOT_FOUND: 'Função não encontrada',
  },
  DEPARTMENT: {
    ALREADY_EXISTS: 'DEPARTAMENTO com este nome já existe.',
    DEPARTMENT_SUCCESSFULLY_DELETED: 'DEPARTAMENTO Excluído com Sucesso',
    NOT_FOUND: 'DEPARTAMENTO não encontrado',
  },
  USER: {
    ALREADY_VERIFIED: 'Conta já está verificada',
    ROLE_ASSIGN: 'Por favor, aguarde até que o administrador atribua uma função a você.',
    ACCOUNT_VERIFIED: 'Por favor, verifique seu e-mail e confirme sua conta.',
    LICENSED_CANCEL: 'Por favor, entre em contato com a autorização.',
    USER_DELETED: 'Por favor, entre em contato com a autorização.',
    ALREADY_EXISTS: 'Usuário com este e-mail já existe.',
    INVALID_PHONE: 'Número de telefone inválido. Deve conter 10 dígitos',
    NOT_SUPER_ADMIN: 'Usuário não é Super Admin',
    UNVERIFIED: 'Usuário não verificado',
    DOES_NOT_EXIST: 'Usuário não existe.',
    EMAIL_ALREADY_EXISTS: 'E-mail já existe.',
    CANNOT_DELETE_OWN_ACCOUNT: 'Você não pode excluir sua própria conta',
    ADMIN_CANNOT_DELETED: 'O Super Admin padrão não pode ser excluído.',
    ACCESS_DENIED: 'Acesso de Exclusão Negado.',
    USER_SUCCESSFULLY_DELETED: 'Usuário Excluído com Sucesso',
    ACCOUNT_SUSPENDED: 'Sua conta foi suspensa!',
    NOT_VALID_OTP: 'OTP para este usuário não é válido',
    VERIFY_OTP_FIRST: 'Por favor, verifique primeiro com o OTP',
  },
  PLAN: {
    ALREADY_EXISTS: 'Plano deste Investidor já existe.',
    INVESTMENT_OF_THIS_MONTH: 'Investimento deste mês não existe.',
  },
  STATEMENT: {
    ALREADY_EXISTS: 'Extrato deste mês já existe.',
  },
};
