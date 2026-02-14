FROM dkr.acr.builder-tools.aws.dev/external/public-ecr-aws/lambda/python:3.12

ARG COMMON_CODE_DIRECTORY

RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=secret,id=pipconf,target=/root/.config/pip/pip.conf \
    pip install uv==0.9.22

RUN --mount=type=secret,id=uvtoml,target=/root/.config/uv/uv.toml \
    --mount=type=cache,target=/root/.cache/uv \
    --mount=from=deps,source=requirements.txt,target=/deps/requirements.txt \
    uv pip install --system -r /deps/requirements.txt

COPY ./common ./${COMMON_CODE_DIRECTORY}

COPY --from=code_directory ./ ./