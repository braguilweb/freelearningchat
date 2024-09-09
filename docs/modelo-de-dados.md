## Modelo de Dados - FreeLearningChat

Este documento descreve o modelo de dados do banco de dados relacional (PostgreSQL) do FreeLearningChat, uma plataforma de aprendizagem de idiomas baseada em chat. O modelo de dados visa fornecer uma estrutura eficiente e escalável para armazenar e gerenciar as informações essenciais do aplicativo, como usuários, grupos, mensagens e interações com bots.

### Diagrama do Modelo de Dados:

![Diagrama do Modelo de Dados](./modelo-de-dados.png)

### Descrição das Tabelas:

**1. Users (Usuários):**

| Coluna           | Tipo de Dado | Descrição                                                                      | Restrições                                |
| ---------------- | ------------- | --------------------------------------------------------------------------------- | ------------------------------------------ |
| `user_id`        | UUID          | Identificador único do usuário.                                                | Chave Primária                              |
| `name`            | VARCHAR(255)  | Nome do usuário.                                                               | `NOT NULL`                                |
| `email`           | VARCHAR(255)  | Email do usuário (único).                                                       | `UNIQUE`, `NOT NULL`                     |
| `password_hash`   | VARCHAR(255)  | Hash da senha do usuário (armazenada de forma segura).                         | `NOT NULL`                                |
| `birth_date`      | DATE          | Data de nascimento do usuário.                                                   |                                            |
| `city`            | VARCHAR(255)  | Cidade de residência do usuário.                                                  |                                            |
| `hobbies`         | TEXT          | Hobbies do usuário.                                                             |                                            |
| `language_level` | VARCHAR(50)   | Nível de conhecimento do idioma principal que o usuário está aprendendo.       |                                            |
| `is_premium`      | BOOLEAN       | Indica se o usuário possui uma assinatura premium. (Padrão: `false`)          |                                            |
| `followers_count` | INTEGER       | Número de seguidores do usuário. (Padrão: 0)                                   |                                            |
| `groups_count`    | INTEGER       | Número de grupos dos quais o usuário participa. (Padrão: 0)                       |                                            |
| `status`          | VARCHAR(50)   | Status de conversa do usuário (online/offline). (Padrão: "offline")            |                                            |
| `profile_image`   | TEXT          | Caminho ou URL para a imagem de perfil do usuário.                             |                                            |
| `badges`          | TEXT\[]        | Array com os IDs dos badges adquiridos pelo usuário (relacionado com a tabela `Badges`). |                                            |
| `created_at`      | TIMESTAMP     | Data e hora de criação do registro (gerado automaticamente).                     |                                            |
| `updated_at`      | TIMESTAMP     | Data e hora da última atualização do registro (gerado automaticamente).          |                                            |
| `version`        | INTEGER       | Número da versão do registro (opcional, para controle de concorrência otimista). |                                            |

**Motivo:** Armazena as informações pessoais, de status e de interação dos usuários.

**2. Groups (Grupos):**

| Coluna             | Tipo de Dado | Descrição                                                                    | Restrições                                |
| ---------------- | ------------- | ------------------------------------------------------------------------------- | ------------------------------------------ |
| `group_id`          | UUID          | Identificador único do grupo.                                              | Chave Primária                              |
| `group_name`        | VARCHAR(255)  | Nome do grupo.                                                             | `NOT NULL`                                |
| `created_by`        | UUID          | Referência ao `user_id` do criador do grupo (chave estrangeira para `Users`). | `NOT NULL`, `REFERENCES Users("user_id")` |
| `administrators`   | UUID\[]        | Array com os IDs dos administradores do grupo (relacionado com `Users`).     |                                            |
| `group_image`       | TEXT          | Caminho ou URL para a imagem do grupo.                                      |                                            |
| `is_premium_only`   | BOOLEAN       | Indica se o grupo é exclusivo para usuários premium. (Padrão: `false`)        |                                            |
| `created_at`        | TIMESTAMP     | Data e hora de criação do grupo (gerado automaticamente).                   |                                            |
| `updated_at`        | TIMESTAMP     | Data e hora da última atualização do grupo (gerado automaticamente).        |                                            |
| `version`           | INTEGER       | Número da versão do registro (opcional, para controle de concorrência otimista). |                                            |

**Motivo:** Armazena informações sobre os grupos de conversa, incluindo detalhes sobre a criação, administração e restrições de acesso.

**3. Group\_Members (Membros do Grupo):**

| Coluna            | Tipo de Dado | Descrição                                                                     | Restrições                                |
| ---------------- | ------------- | -------------------------------------------------------------------------------- | ------------------------------------------ |
| `group_member_id` | UUID          | Identificador único do relacionamento membro-grupo.                             | Chave Primária                              |
| `group_id`         | UUID          | Referência ao `group_id` na tabela `Groups`.                                 | `NOT NULL`, `REFERENCES Groups(group_id)` |
| `user_id`          | UUID          | Referência ao `user_id` na tabela `Users`.                                    | `NOT NULL`, `REFERENCES Users("user_id")` |
| `is_admin`        | BOOLEAN       | Indica se o usuário é administrador do grupo. (Padrão: `false`)               |                                            |
| `joined_at`       | TIMESTAMP     | Data e hora em que o usuário entrou no grupo.                                  |                                            |

**Motivo:** Gerencia a associação entre usuários e grupos, definindo se um usuário é administrador ou membro regular de um grupo específico.

**4. Followers (Seguidores):**

| Coluna            | Tipo de Dado | Descrição                                                                     | Restrições                                |
| ---------------- | ------------- | -------------------------------------------------------------------------------- | ------------------------------------------ |
| `follower_id`     | UUID          | Identificador único do relacionamento seguidor-seguido.                         | Chave Primária                              |
| `user_id`          | UUID          | Referência ao `user_id` do usuário que está sendo seguido (chave estrangeira para `Users`). | `NOT NULL`, `REFERENCES Users("user_id")` |
| `follower_user_id` | UUID          | Referência ao `user_id` do seguidor (chave estrangeira para `Users`).           | `NOT NULL`, `REFERENCES Users("user_id")` |
| `followed_at`      | TIMESTAMP     | Data e hora em que o usuário começou a seguir outro usuário.                  |                                            |

**Motivo:**  Controla as relações de "seguir" entre os usuários, definindo quem segue quem.

**5. Blocked\_Users (Usuários Bloqueados):**

| Coluna          | Tipo de Dado | Descrição                                                                     | Restrições                                |
| ---------------- | ------------- | -------------------------------------------------------------------------------- | ------------------------------------------ |
| `blocked_user_id` | UUID          | Identificador único do relacionamento de bloqueio.                            | Chave Primária                              |
| `user_id`        | UUID          | Referência ao `user_id` do usuário que bloqueou (chave estrangeira para `Users`). | `NOT NULL`, `REFERENCES Users("user_id")` |
| `blocked_id`     | UUID          | Referência ao `user_id` do usuário que foi bloqueado (chave estrangeira para `Users`). | `NOT NULL`, `REFERENCES Users("user_id")` |
| `blocked_at`      | TIMESTAMP     | Data e hora em que o bloqueio foi efetuado.                                    |                                            |

**Motivo:**  Permite que os usuários bloqueiem outros usuários, evitando interações indesejadas.

**6. Messages (Mensagens):**

| Coluna        | Tipo de Dado | Descrição                                                                                         | Restrições                                |
| ---------------- | ------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `message_id`   | UUID          | Identificador único da mensagem.                                                                   | Chave Primária                              |
| `sender_id`     | UUID          | Referência ao `user_id` do usuário que enviou a mensagem (chave estrangeira para `Users`).             | `NOT NULL`, `REFERENCES Users("user_id")` |
| `receiver_id`   | UUID          | Referência ao `user_id` do usuário que recebeu a mensagem (chave estrangeira para `Users`, opcional). | `REFERENCES Users("user_id")`              |
| `group_id`       | UUID          | Referência ao `group_id` do grupo (chave estrangeira para `Groups`, opcional).                      | `REFERENCES Groups(group_id)`             |
| `content`      | TEXT          | Conteúdo da mensagem.                                                                              | `NOT NULL`                                |
| `sent_at`       | TIMESTAMP     | Data e hora de envio da mensagem (gerado automaticamente).                                           |                                            |

**Motivo:**  Armazena todas as mensagens trocadas na plataforma, sejam elas em conversas privadas ou em grupos.

**7. Bot\_Interactions (Interações com Bot):**

| Coluna            | Tipo de Dado | Descrição                                                                       | Restrições                                |
| ---------------- | ------------- | ---------------------------------------------------------------------------------- | ------------------------------------------ |
| `interaction_id` | UUID          | Identificador único da interação.                                               | Chave Primária                              |
| `user_id`          | UUID          | Referência ao `user_id` do usuário que interagiu com o bot (chave estrangeira para `Users`). | `NOT NULL`, `REFERENCES Users("user_id")` |
| `group_id`         | UUID          | Referência ao `group_id` do grupo (chave estrangeira para `Groups`, opcional).    | `REFERENCES Groups(group_id)`             |
| `interaction_type` | VARCHAR(50)   | Tipo de interação (ex.: "pergunta", "resposta").                               | `NOT NULL`                                |
| `content`          | TEXT          | Conteúdo da interação.                                                          | `NOT NULL`                                |
| `occurred_at`      | TIMESTAMP     | Data e hora da interação (gerado automaticamente).                               |                                            |

**Motivo:**  Registra as interações dos usuários com os bots, permitindo análises de uso e futuras melhorias.

**8. Languages (Idiomas - Opcional):**

| Coluna         | Tipo de Dado | Descrição                              | Restrições           |
| ---------------- | ------------- | ---------------------------------------- | --------------------- |
| `language_id`   | UUID          | Identificador único do idioma.         | Chave Primária       |
| `language_name` | VARCHAR(255)  | Nome do idioma (ex.: "Inglês", "Espanhol"). | `NOT NULL`, `UNIQUE` |

**Motivo:**  Armazena a lista de idiomas suportados pela plataforma, permitindo expansão futura.

**9. Badges (Badges - Opcional):**

| Coluna            | Tipo de Dado | Descrição                             | Restrições           |
| ---------------- | ------------- | --------------------------------------- | --------------------- |
| `badge_id`        | UUID          | Identificador único do badge.          | Chave Primária       |
| `badge_name`      | VARCHAR(255)  | Nome do badge.                         | `NOT NULL`, `UNIQUE` |
| `badge_description` | TEXT          | Descrição do badge.                    |                       |
| `badge_image`      | TEXT          | Caminho ou URL para a imagem do badge. |                       |

**Motivo:**  Armazena informações sobre os badges que os usuários podem conquistar.

**10. UserBadges (Usuários e Badges - Opcional):**

| Coluna         | Tipo de Dado | Descrição                                                                        | Restrições                                |
| ---------------- | ------------- | ---------------------------------------------------------------------------------- | ------------------------------------------ |
| `user_badge_id` | UUID          | Identificador único do relacionamento usuário-badge.                              | Chave Primária                              |
| `user_id`       | UUID          | Referência ao `user_id` na tabela `Users` (chave estrangeira).                     | `NOT NULL`, `REFERENCES Users("user_id")` |
| `badge_id`       | UUID          | Referência ao `badge_id` na tabela `Badges` (chave estrangeira).                    | `NOT NULL`, `REFERENCES Badges(badge_id)` |
| `acquired_at`   | TIMESTAMP     | Data e hora em que o usuário adquiriu o badge.                                 |                                            |

**Motivo:**  Gerencia quais badges cada usuário conquistou e quando.

### Considerações Adicionais:

* **Índices:** Índices foram criados em colunas estratégicas para otimizar consultas frequentes, como buscas por email, mensagens de um usuário específico ou mensagens de um grupo específico.
* **Restrições:** Restrições de chave estrangeira garantem a integridade referencial entre as tabelas, impedindo a criação de registros inconsistentes.  Restrições adicionais, como impedir que um usuário siga alguém que o bloqueou, podem ser implementadas para reforçar a lógica de negócio.
* **Escalabilidade:** O modelo de dados está preparado para escalar, permitindo a adição de novas funcionalidades e a implementação de técnicas de otimização de banco de dados, como replicação e particionamento, quando necessário.

**Este modelo de dados bem definido e documentado fornece uma base sólida para o desenvolvimento do FreeLearningChat!** 🚀 
